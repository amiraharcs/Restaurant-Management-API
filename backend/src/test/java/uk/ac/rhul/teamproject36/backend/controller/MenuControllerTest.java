package uk.ac.rhul.teamproject36.backend.controller;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.teamproject36.backend.menu.ItemType;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.service.MenuService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MenuControllerTest {

    @Test
    void getMenuWithoutFiltersUsesCustomerGroupedMenu() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        when(menuService.getMenuGroupedForCustomers()).thenReturn(Collections.emptyMap());

        Map<String, List<MenuService.MenuItemDto>> result =
                controller.getMenu(null, null, null, null);

        assertNotNull(result);
        verify(menuService).getMenuGroupedForCustomers();
        verify(menuService, never()).getFilteredMenuGrouped(any(), any(), any(), any());
    }

    @Test
    void getMenuWithFiltersUsesFilteredMenu() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        when(menuService.getFilteredMenuGrouped(eq(ItemType.FOOD), eq(List.of("vegan")), eq(500), eq("nuts")))
                .thenReturn(Collections.emptyMap());

        Map<String, List<MenuService.MenuItemDto>> result =
                controller.getMenu(ItemType.FOOD, List.of("vegan"), 500, "nuts");

        assertNotNull(result);
        verify(menuService).getFilteredMenuGrouped(ItemType.FOOD, List.of("vegan"), 500, "nuts");
    }

    @Test
    void updateAvailabilityBadRequestWhenBodyMissingValue() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        MenuController.AvailabilityUpdateRequest request =
                new MenuController.AvailabilityUpdateRequest();

        ResponseEntity<Void> response = controller.updateAvailability(1L, request);

        assertEquals(400, response.getStatusCode().value());
        verify(menuService, never()).updateAvailability(anyLong(), anyBoolean());
    }

    @Test
    void updateAvailabilityOkWhenFound() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        MenuController.AvailabilityUpdateRequest request =
                new MenuController.AvailabilityUpdateRequest();
        request.setAvailable(true);

        ResponseEntity<Void> response = controller.updateAvailability(1L, request);

        assertEquals(200, response.getStatusCode().value());
        verify(menuService).updateAvailability(1L, true);
    }

    @Test
    void updateAvailabilityNotFoundWhenEntityMissing() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        doThrow(new EntityNotFoundException("missing")).when(menuService).updateAvailability(1L, false);

        MenuController.AvailabilityUpdateRequest request =
                new MenuController.AvailabilityUpdateRequest();
        request.setAvailable(false);

        ResponseEntity<Void> response = controller.updateAvailability(1L, request);

        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void getMenuItemByIdReturnsOk() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        when(menuService.getMenuItembyId(1L)).thenReturn(null);

        ResponseEntity<MenuService.MenuItemDto> response = controller.getMenuItemById(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(menuService).getMenuItembyId(1L);
    }

    @Test
    void addMenuItemReturnsCreatedEntity() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        MenuItem item = new MenuItem();
        when(menuService.addMenuItem(item)).thenReturn(item);

        ResponseEntity<MenuItem> response = controller.addMenuItem(item);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(item, response.getBody());
        verify(menuService).addMenuItem(item);
    }

    @Test
    void editMenuItemReturnsUpdatedEntity() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        MenuItem item = new MenuItem();
        when(menuService.editMenuItem(1L, item)).thenReturn(item);

        ResponseEntity<MenuItem> response = controller.editMenuItem(1L, item);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(item, response.getBody());
        verify(menuService).editMenuItem(1L, item);
    }

    @Test
    void deleteMenuItemReturnsNoContent() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        ResponseEntity<Void> response = controller.deleteMenuItem(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(menuService).deleteMenuItem(1L);
    }

    @Test
    void getAllMenuItemsReturnsOk() {
        MenuService menuService = mock(MenuService.class);
        MenuController controller = new MenuController(menuService);

        when(menuService.getAllMenuItems()).thenReturn(Collections.emptyList());

        ResponseEntity<List<MenuService.MenuItemDto>> response = controller.getAllMenuItems();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        verify(menuService).getAllMenuItems();
    }
}