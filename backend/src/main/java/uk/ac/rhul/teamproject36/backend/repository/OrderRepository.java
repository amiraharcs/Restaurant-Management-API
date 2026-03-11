package uk.ac.rhul.teamproject36.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    /**
     * Finds all customer orders of a specified order status.
     *
     * @return a list of orders with the specified order status
     */
    List<CustomerOrder> findByStatus(OrderStatus status);
}
