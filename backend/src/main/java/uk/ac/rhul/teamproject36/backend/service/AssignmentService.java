package uk.ac.rhul.teamproject36.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;

/**
 * Handles assigning buffered orders to available waiters.
 * A buffered order is a PLACED order with no assigned waiter.
 * Called after: order created, waiter logs in, order delivered.
 */
@Service
public class AssignmentService {

    private static final List<OrderStatus> DONE_STATUSES =
        List.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED);

    private final OrderRepository orderRepo;
    private final AppUserRepository userRepo;

    public AssignmentService(OrderRepository orderRepo, AppUserRepository userRepo) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
    }

    /**
     * Assigns any unassigned PLACED orders to the online waiter with the fewest active orders.
     * If no waiters are online, orders stay in the buffer.
     */
    @Transactional
    public void assignFromBuffer() {
        List<CustomerOrder> buffered = orderRepo.findByStatusAndAssignedWaiterIsNull(OrderStatus.PLACED);
        if (buffered.isEmpty()) return;

        List<AppUser> onlineWaiters = userRepo.findByRoleAndOnShiftTrue("WAITER");
        if (onlineWaiters.isEmpty()) return;

        for (CustomerOrder order : buffered) {
            AppUser waiter = waiterWithLeastOrders(onlineWaiters);
            order.setAssignedWaiter(waiter);
            orderRepo.save(order);
        }
    }

    // Picks the waiter with the fewest non-completed orders
    private AppUser waiterWithLeastOrders(List<AppUser> waiters) {
        AppUser best = waiters.get(0);
        long minCount = orderRepo.countActiveOrders(best, DONE_STATUSES);

        for (int i = 1; i < waiters.size(); i++) {
            long count = orderRepo.countActiveOrders(waiters.get(i), DONE_STATUSES);
            if (count < minCount) {
                minCount = count;
                best = waiters.get(i);
            }
        }
        return best;
    }
}
