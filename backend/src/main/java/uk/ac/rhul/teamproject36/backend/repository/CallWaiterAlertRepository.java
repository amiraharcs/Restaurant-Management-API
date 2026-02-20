package uk.ac.rhul.teamproject36.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.teamproject36.backend.alert.CallWaiterAlert;

public interface CallWaiterAlertRepository extends JpaRepository<CallWaiterAlert, Long> {

  List<CallWaiterAlert> findByHandledFalseOrderByCreatedAtDesc();
}
