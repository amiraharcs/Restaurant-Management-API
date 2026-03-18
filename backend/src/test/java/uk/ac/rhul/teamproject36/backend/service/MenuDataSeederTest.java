package uk.ac.rhul.teamproject36.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.core.env.Environment;
import uk.ac.rhul.teamproject36.backend.repository.IngredientRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;

import java.util.List;

import static org.mockito.Mockito.*;

class MenuDataSeederTest {

    @Test
    void testRunDoesNotCrashWhenItemsAlreadyExist() throws Exception {
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        IngredientRepository ingredientRepo = mock(IngredientRepository.class);
        Environment env = mock(Environment.class);

        when(env.getProperty("APP_SEED_RESET", "false")).thenReturn("false");
        when(menuRepo.findAll()).thenReturn(List.of());

        MenuDataSeeder seeder = new MenuDataSeeder(menuRepo, ingredientRepo, env);

        seeder.run();
    }
}