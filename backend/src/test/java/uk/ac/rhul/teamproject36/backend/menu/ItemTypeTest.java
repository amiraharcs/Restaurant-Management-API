package uk.ac.rhul.teamproject36.backend.menu;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ItemTypeTest {

    @Test
    void testEnumValues() {
        assertEquals(ItemType.FOOD, ItemType.valueOf("FOOD"));
        assertEquals(ItemType.DESSERT, ItemType.valueOf("DESSERT"));
        assertEquals(ItemType.DRINK, ItemType.valueOf("DRINK"));
        assertEquals(3, ItemType.values().length);
    }
}