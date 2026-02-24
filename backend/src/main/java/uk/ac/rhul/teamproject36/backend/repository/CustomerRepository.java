package uk.ac.rhul.teamproject36.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.ac.rhul.teamproject36.backend.order.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
