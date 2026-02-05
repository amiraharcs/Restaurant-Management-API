package uk.ac.rhul.teamproject36.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.teamproject36.backend.service.MenuService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;

import java.util.List;

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
     * Returns the menu items available to customers.
     *
     * @return list of available menu items
     */
    @GetMapping("/menu")
    public List<MenuService.MenuItemDto> getMenu() {
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
