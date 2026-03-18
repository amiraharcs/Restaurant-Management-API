package uk.ac.rhul.teamproject36.backend.menu;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class IngredientTest {

    @Test
    void testGetterAndSetter() {
        Ingredient ingredient = new Ingredient();

        ingredient.setName("Cheese");

        assertEquals("Cheese", ingredient.getName());
    }

    @Test
    void testDefaultIdIsNull() {
        Ingredient ingredient = new Ingredient();

        assertNull(ingredient.getId());
    }
}