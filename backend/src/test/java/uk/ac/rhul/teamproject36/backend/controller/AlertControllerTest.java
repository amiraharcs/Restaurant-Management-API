package uk.ac.rhul.teamproject36.backend.controller;

import org.junit.jupiter.api.Test;
import uk.ac.rhul.teamproject36.backend.alert.CallWaiterAlert;
import uk.ac.rhul.teamproject36.backend.repository.CallWaiterAlertRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AlertControllerTest {

    @Test
    void createSuccess() {
        CallWaiterAlertRepository repository = mock(CallWaiterAlertRepository.class);
        AlertController controller = new AlertController(repository);

        CallWaiterAlert saved = new CallWaiterAlert();
        saved.setTableNumber(2);
        saved.setCustomerName("Amir");
        saved.setMessage("Need help");
        saved.setHandled(false);

        when(repository.save(any(CallWaiterAlert.class))).thenReturn(saved);

        AlertController.CreateAlertRequest request =
                new AlertController.CreateAlertRequest(2, "Amir", "Need help");

        AlertController.AlertDto result = controller.create(request);

        assertEquals(2, result.tableNumber());
        assertEquals("Amir", result.customerName());
        assertEquals("Need help", result.message());
        assertFalse(result.handled());
        verify(repository).save(any(CallWaiterAlert.class));
    }

    @Test
    void createInvalidThrows() {
        CallWaiterAlertRepository repository = mock(CallWaiterAlertRepository.class);
        AlertController controller = new AlertController(repository);

        AlertController.CreateAlertRequest request =
                new AlertController.CreateAlertRequest(null, "", "");

        IllegalArgumentException ex =
                assertThrows(IllegalArgumentException.class, () -> controller.create(request));

        assertEquals("tableNumber, customerName and message are required", ex.getMessage());
    }

    @Test
    void getUnhandledReturnsDtos() {
        CallWaiterAlertRepository repository = mock(CallWaiterAlertRepository.class);
        AlertController controller = new AlertController(repository);

        CallWaiterAlert alert = new CallWaiterAlert();
        alert.setTableNumber(5);
        alert.setCustomerName("Sam");
        alert.setMessage("Water please");
        alert.setHandled(false);

        when(repository.findByHandledFalseOrderByCreatedAtDesc()).thenReturn(List.of(alert));

        List<AlertController.AlertDto> result = controller.getUnhandled();

        assertEquals(1, result.size());
        assertEquals(5, result.get(0).tableNumber());
        assertEquals("Sam", result.get(0).customerName());
        verify(repository).findByHandledFalseOrderByCreatedAtDesc();
    }

    @Test
    void markHandledSuccess() {
        CallWaiterAlertRepository repository = mock(CallWaiterAlertRepository.class);
        AlertController controller = new AlertController(repository);

        CallWaiterAlert alert = new CallWaiterAlert();
        alert.setTableNumber(3);
        alert.setCustomerName("Alex");
        alert.setMessage("Bill please");
        alert.setHandled(false);

        when(repository.findById(1L)).thenReturn(Optional.of(alert));
        when(repository.save(alert)).thenReturn(alert);

        AlertController.AlertDto result = controller.markHandled(1L);

        assertTrue(alert.isHandled());
        assertTrue(result.handled());
        verify(repository).findById(1L);
        verify(repository).save(alert);
    }

    @Test
    void markHandledMissingThrows() {
        CallWaiterAlertRepository repository = mock(CallWaiterAlertRepository.class);
        AlertController controller = new AlertController(repository);

        when(repository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex =
                assertThrows(IllegalArgumentException.class, () -> controller.markHandled(99L));

        assertEquals("alert not found", ex.getMessage());
    }

    @Test
    void handleIllegalArgumentReturnsErrorResponse() {
        CallWaiterAlertRepository repository = mock(CallWaiterAlertRepository.class);
        AlertController controller = new AlertController(repository);

        AlertController.ErrorResponse response =
                controller.handleIllegalArgument(new IllegalArgumentException("bad request"));

        assertEquals("bad request", response.error());
    }
}