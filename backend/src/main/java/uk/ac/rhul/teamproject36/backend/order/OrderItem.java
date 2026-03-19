package uk.ac.rhul.teamproject36.backend.order;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;

@Entity
@Table(name = "order_item")
@IdClass(OrderItemId.class)
public class OrderItem {

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private Integer quantity;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;

    @Column(columnDefinition = "TEXT")
    private String customisations;
    
    public OrderItem() {}

    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem menuItem) { this.menuItem = menuItem; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public CustomerOrder getOrder() { return order; }
    public void setOrder(CustomerOrder order) { this.order = order; }

    public String getCustomisations() {return customisations;}
    public void setCustomisations(String customisations) {this.customisations = customisations;}

}
