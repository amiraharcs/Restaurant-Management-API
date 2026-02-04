package uk.ac.rhul.teamproject36.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {}
