package uk.ac.rhul.teamproject36.backend.alert;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "call_waiter_alert")
public class CallWaiterAlert {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "table_number", nullable = false)
  private Integer tableNumber;

  @Column(name = "customer_name", nullable = false)
  private String customerName;

  @Column(name = "message", nullable = false)
  private String message;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "handled", nullable = false)
  private boolean handled;

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }

  public Long getId() {
    return id;
  }

  public Integer getTableNumber() {
    return tableNumber;
  }

  public void setTableNumber(final Integer newTableNumber) {
    this.tableNumber = newTableNumber;
  }

  public String getCustomerName() {
    return customerName;
  }

  public void setCustomerName(final String newCustomerName) {
    this.customerName = newCustomerName;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(final String newMessage) {
    this.message = newMessage;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public boolean isHandled() {
    return handled;
  }

  public void setHandled(final boolean isHandledValue) {
    this.handled = isHandledValue;
  }
}
