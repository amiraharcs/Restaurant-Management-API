package uk.ac.rhul.teamproject36.backend.order;

import java.io.Serializable;
import java.util.Objects;

public class OrderItemId implements Serializable {
    private Long order;
    private Long menuItem;

    public OrderItemId() {}

    public OrderItemId(Long order, Long menuItem) {
        this.order = order;
        this.menuItem = menuItem;
    }

    public Long getOrder() { return order; }
    public void setOrder(Long order) { this.order = order; }

    public Long getMenuItem() { return menuItem; }
    public void setMenuItem(Long menuItem) { this.menuItem = menuItem; }
}