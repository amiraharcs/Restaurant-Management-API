package uk.ac.rhul.teamproject36.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    /**
     * Finds all menu items that are currently available.
     *
     * @return a list of available menu items
     */
    List<MenuItem> findByAvailableTrue();
}
