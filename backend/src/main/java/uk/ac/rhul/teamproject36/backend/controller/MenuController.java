package uk.ac.rhul.teamproject36.backend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.persistence.EntityNotFoundException;
import uk.ac.rhul.teamproject36.backend.service.MenuService;

@RestController
@RequestMapping("/api")
public final class MenuController {

    /** The menu service for handling menu operations. */
    private final MenuService menuService;

    /**
     * Constructs a new MenuController with the given menu service.
     *
     * @param service the menu service
     */
    public MenuController(final MenuService service) {
        this.menuService = service;
    }

    /**
     * Returns the menu items available to customers, with optional filters.
     *
     * @param category filter by category (optional)
     * @param vegetarian show only vegetarian items (optional)
     * @param glutenFree show only gluten-free items (optional)
     * @return filtered list of available menu items
     */
    @GetMapping("/menu")
    public List<MenuService.MenuItemDto> getMenu(@RequestParam(required = false) String category,
        @RequestParam(required = false) Boolean vegetarian,
        @RequestParam(required = false, name = "gluten_free") Boolean glutenFree,
        @RequestParam(required = false) Integer maxCalories,
        @RequestParam(required = false) String allergen) {

      if (vegetarian != null || glutenFree != null || category != null || maxCalories != null
          || allergen != null) {
        return menuService.getFilteredMenu(category, vegetarian, glutenFree, maxCalories, allergen);
      }
        return menuService.getMenuForCustomers();
    }

    /**
     * Request body for updating a menu item's availability.
     */
    public static final class AvailabilityUpdateRequest {

        private Boolean available;

        public Boolean getAvailable() {
            return available;
        }

        public void setAvailable(final Boolean available) {
            this.available = available;
        }
    }

    /**
     * Updates the availability of a menu item.
     *
     * @param id      the menu item id
     * @param request the availability update request body
     * @return HTTP status indicating the result
     */
    @PatchMapping("/menu/{id}/availability")
    public ResponseEntity<Void> updateAvailability(
            @PathVariable final Long id,
            @RequestBody final AvailabilityUpdateRequest request) {

        if (request == null || request.getAvailable() == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            menuService.updateAvailability(id, request.getAvailable());
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
