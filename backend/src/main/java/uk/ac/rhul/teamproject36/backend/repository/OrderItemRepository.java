package uk.ac.rhul.teamproject36.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.teamproject36.backend.order.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}
