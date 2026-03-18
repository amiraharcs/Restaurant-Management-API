package uk.ac.rhul.teamproject36.backend.service;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import uk.ac.rhul.teamproject36.backend.menu.Ingredient;
import uk.ac.rhul.teamproject36.backend.menu.ItemType;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.IngredientRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MenuServiceTest {

    @Test
    void getMenuGroupedForCustomers_groupsByTypeAndDefaultsNullTypeToFood() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        MenuItem food = item("Taco", ItemType.FOOD);
        MenuItem dessert = item("Cake", ItemType.DESSERT);
        MenuItem noType = item("Mystery", null);

        when(itemRepo.findByAvailableTrue()).thenReturn(List.of(food, dessert, noType));

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);

        var grouped = service.getMenuGroupedForCustomers();

        assertEquals(2, grouped.get("FOOD").size());
        assertEquals(1, grouped.get("DESSERT").size());
        assertEquals(0, grouped.get("DRINK").size());
    }

    @Test
    void getFilteredMenuGrouped_usesExpectedFlags() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        when(menuRepo.findFiltered(ItemType.FOOD, true, false, 500, "nuts"))
                .thenReturn(List.of(item("Salad", ItemType.FOOD)));

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);

        var grouped = service.getFilteredMenuGrouped(
                ItemType.FOOD,
                List.of("is_vegetarian"),
                500,
                "nuts");

        assertEquals(1, grouped.get("FOOD").size());
    }

    @Test
    void updateAvailability_success() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        MenuItem item = item("Taco", ItemType.FOOD);
        when(itemRepo.findById(1L)).thenReturn(Optional.of(item));

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);
        service.updateAvailability(1L, false);

        assertFalse(item.isAvailable());
        verify(itemRepo).save(item);
    }

    @Test
    void updateAvailability_notFound() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        when(itemRepo.findById(1L)).thenReturn(Optional.empty());

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);

        assertThrows(EntityNotFoundException.class, () -> service.updateAvailability(1L, true));
    }

    @Test
    void getMenuItemById_success() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        MenuItem item = item("Taco", ItemType.FOOD);
        when(itemRepo.findById(1L)).thenReturn(Optional.of(item));

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);

        assertEquals("Taco", service.getMenuItembyId(1L).name());
    }

    @Test
    void getAllMenuItems_mapsDtos() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        when(itemRepo.findAll()).thenReturn(List.of(item("Taco", ItemType.FOOD)));

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);

        assertEquals(1, service.getAllMenuItems().size());
    }

    @Test
    void addMenuItem_reusesExistingIngredient() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        Ingredient existing = new Ingredient();
        existing.setName("Cheese");

        MenuItem item = item("Quesadilla", ItemType.FOOD);
        Ingredient requestIngredient = new Ingredient();
        requestIngredient.setName(" Cheese ");
        item.setIngredients(Set.of(requestIngredient));

        when(ingredientRepo.findByNameIgnoreCase("Cheese")).thenReturn(Optional.of(existing));
        when(itemRepo.save(item)).thenReturn(item);

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);

        MenuItem saved = service.addMenuItem(item);

        assertEquals(1, saved.getIngredients().size());
        verify(itemRepo).save(item);
        verify(ingredientRepo, never()).save(any());
    }

    @Test
    void addMenuItem_createsNewIngredient() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        Ingredient created = new Ingredient();
        created.setName("Chicken");

        MenuItem item = item("Taco", ItemType.FOOD);
        Ingredient requestIngredient = new Ingredient();
        requestIngredient.setName(" Chicken ");
        item.setIngredients(Set.of(requestIngredient));

        when(ingredientRepo.findByNameIgnoreCase("Chicken")).thenReturn(Optional.empty());
        when(ingredientRepo.save(any(Ingredient.class))).thenReturn(created);
        when(itemRepo.save(item)).thenReturn(item);

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);
        service.addMenuItem(item);

        verify(ingredientRepo).save(any(Ingredient.class));
        verify(itemRepo).save(item);
    }

    @Test
    void addMenuItem_rejectsBadMargin() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        MenuItem item = item("Cheap", ItemType.FOOD);
        item.setPrice(new BigDecimal("5.00"));
        item.setCostToProduce(new BigDecimal("4.00"));

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);

        assertThrows(IllegalArgumentException.class, () -> service.addMenuItem(item));
    }

    @Test
    void editMenuItem_success() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        MenuItem existing = item("Old", ItemType.FOOD);
        MenuItem updated = item("New", ItemType.DESSERT);

        Ingredient ingredient = new Ingredient();
        ingredient.setName("Cheese");
        updated.setIngredients(Set.of(ingredient));

        when(itemRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(ingredientRepo.findByNameIgnoreCase("Cheese")).thenReturn(Optional.of(ingredient));
        when(itemRepo.save(existing)).thenReturn(existing);

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);
        MenuItem result = service.editMenuItem(1L, updated);

        assertEquals("New", result.getName());
        assertEquals(ItemType.DESSERT, result.getItemType());
    }

    @Test
    void editMenuItem_notFound() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        when(itemRepo.findById(1L)).thenReturn(Optional.empty());

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);

        assertThrows(EntityNotFoundException.class, () -> service.editMenuItem(1L, item("X", ItemType.FOOD)));
    }

    @Test
    void deleteMenuItem_success() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        when(itemRepo.existsById(1L)).thenReturn(true);

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);
        service.deleteMenuItem(1L);

        verify(itemRepo).deleteById(1L);
    }

    @Test
    void deleteMenuItem_notFound() {
        MenuItemRepository itemRepo = mock(MenuItemRepository.class);
        MenuRepository menuRepo = mock(MenuRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);

        when(itemRepo.existsById(1L)).thenReturn(false);

        MenuService service = new MenuService(itemRepo, menuRepo, ingredientRepo);

        assertThrows(EntityNotFoundException.class, () -> service.deleteMenuItem(1L));
    }

    private MenuItem item(String name, ItemType type) {
        MenuItem item = new MenuItem();
        item.setId(1L);
        item.setName(name);
        item.setDescription("desc");
        item.setPrice(new BigDecimal("10.00"));
        item.setCostToProduce(new BigDecimal("4.00"));
        item.setCalories(100);
        item.setAllergens("nuts, dairy");
        item.setAvailable(true);
        item.setImageUrl("img");
        item.setVegetarian(true);
        item.setMeat(false);
        item.setVegan(false);
        item.setGlutenFree(true);
        item.setItemType(type);

        Ingredient ingredient = new Ingredient();
        ingredient.setName("Cheese");
        item.setIngredients(Set.of(ingredient));
        return item;
    }
}