package uk.ac.rhul.teamproject36.backend.menu;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class MenuItemTest {

    @Test
    void testGettersAndSetters() {
        MenuItem item = new MenuItem();
        Ingredient ingredient = new Ingredient();
        ingredient.setName("Chicken");

        Set<Ingredient> ingredients = new HashSet<>();
        ingredients.add(ingredient);

        item.setName("Chicken Fajitas");
        item.setDescription("Tasty");
        item.setPrice(new BigDecimal("12.50"));
        item.setCostToProduce(new BigDecimal("5.00"));
        item.setCalories(650);
        item.setAllergens("Dairy");
        item.setAvailable(false);
        item.setImageUrl("image.jpg");
        item.setVegetarian(false);
        item.setMeat(true);
        item.setItemType(ItemType.FOOD);
        item.setVegan(false);
        item.setGlutenFree(true);
        item.setIngredients(ingredients);

        assertEquals("Chicken Fajitas", item.getName());
        assertEquals("Tasty", item.getDescription());
        assertEquals(new BigDecimal("12.50"), item.getPrice());
        assertEquals(new BigDecimal("5.00"), item.getCostToProduce());
        assertEquals(650, item.getCalories());
        assertEquals("Dairy", item.getAllergens());
        assertFalse(item.isAvailable());
        assertEquals("image.jpg", item.getImageUrl());
        assertFalse(item.isVegetarian());
        assertTrue(item.isMeat());
        assertEquals(ItemType.FOOD, item.getItemType());
        assertFalse(item.isVegan());
        assertTrue(item.isGlutenFree());
        assertEquals(ingredients, item.getIngredients());
    }

    @Test
    void testDefaults() {
        MenuItem item = new MenuItem();

        assertNull(item.getId());
        assertTrue(item.isAvailable());
        assertNotNull(item.getIngredients());
        assertTrue(item.getIngredients().isEmpty());
    }
}