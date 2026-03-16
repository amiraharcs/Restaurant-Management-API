package uk.ac.rhul.teamproject36.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    List<CustomerOrder> findByStatus(OrderStatus status);

    // Orders in the buffer: PLACED with no waiter yet assigned
    List<CustomerOrder> findByStatusAndAssignedWaiterIsNull(OrderStatus status);

    // All orders belonging to a specific waiter
    List<CustomerOrder> findByAssignedWaiterUsername(String username);

    // Count active orders for a waiter (excludes DELIVERED and CANCELLED)
    @Query("SELECT COUNT(o) FROM CustomerOrder o WHERE o.assignedWaiter = :waiter AND o.status NOT IN :excluded")
    long countActiveOrders(@Param("waiter") AppUser waiter, @Param("excluded") List<OrderStatus> excluded);
}
