package uk.ac.rhul.teamproject36.backend.order;


import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;

class OrderItemExtraTest {

    @Test
    void testMenuItemGetterSetter() {
        OrderItem item = new OrderItem();
        MenuItem menuItem = new MenuItem();

        item.setMenuItem(menuItem);

        assertEquals(menuItem, item.getMenuItem());
    }
}