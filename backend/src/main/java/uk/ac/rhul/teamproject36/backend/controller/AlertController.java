package uk.ac.rhul.teamproject36.backend.controller;

import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.teamproject36.backend.alert.CallWaiterAlert;
import uk.ac.rhul.teamproject36.backend.repository.CallWaiterAlertRepository;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

  private final CallWaiterAlertRepository repository;

  public AlertController(final CallWaiterAlertRepository repository) {
    this.repository = repository;
  }

  public record CreateAlertRequest(Integer tableNumber, String customerName, String message) {
  }

  public record AlertDto(Long id, Integer tableNumber, String customerName, String message,
                         Instant createdAt, boolean handled) {
  }

  @PostMapping("/call-waiter")
  @ResponseStatus(HttpStatus.CREATED)
  public AlertDto create(@RequestBody final CreateAlertRequest request) {
    if (request == null
        || request.tableNumber() == null
        || request.tableNumber() <= 0
        || request.customerName() == null
        || request.customerName().trim().isEmpty()
        || request.message() == null
        || request.message().trim().isEmpty()) {
      throw new IllegalArgumentException("tableNumber, customerName and message are required");
    }

    final CallWaiterAlert alert = new CallWaiterAlert();
    alert.setTableNumber(request.tableNumber());
    alert.setCustomerName(request.customerName().trim());
    alert.setMessage(request.message().trim());
    alert.setHandled(false);

    return toDto(repository.save(alert));
  }

  @GetMapping("/call-waiter")
  public List<AlertDto> getUnhandled() {
    return repository.findByHandledFalseOrderByCreatedAtDesc().stream().map(this::toDto).toList();
  }

  @PatchMapping("/call-waiter/{id}/handled")
  public AlertDto markHandled(@PathVariable final Long id) {
    final CallWaiterAlert alert = repository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("alert not found"));
    alert.setHandled(true);
    return toDto(repository.save(alert));
  }

  @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ErrorResponse handleIllegalArgument(final IllegalArgumentException ex) {
    return new ErrorResponse(ex.getMessage());
  }

  public record ErrorResponse(String error) {
  }

  private AlertDto toDto(final CallWaiterAlert alert) {
    return new AlertDto(
        alert.getId(),
        alert.getTableNumber(),
        alert.getCustomerName(),
        alert.getMessage(),
        alert.getCreatedAt(),
        alert.isHandled());
  }
}
