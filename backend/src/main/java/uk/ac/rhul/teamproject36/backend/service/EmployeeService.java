package uk.ac.rhul.teamproject36.backend.service;

import org.springframework.stereotype.Service;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.dataTransferObjects.EmployeeDataResponse;
import uk.ac.rhul.teamproject36.backend.dataTransferObjects.EmployeeOrderInfoResponse;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderItem;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeService {

    private final AppUserRepository appUserRepository;
    private final OrderRepository orderRepository;

    public EmployeeService(AppUserRepository appUserRepository, OrderRepository orderRepository) {
        this.appUserRepository = appUserRepository;
        this.orderRepository = orderRepository;
    }

    public List<EmployeeDataResponse> getAllEmployeeData() {
        List<AppUser> employees = appUserRepository.findByRoleNot("MANAGER");

        List<EmployeeDataResponse> response = new ArrayList<>();

        for (AppUser employee : employees) {
            EmployeeDataResponse dto = new EmployeeDataResponse();
            dto.setEmployeeId(employee.getUserId());
            dto.setUsername(employee.getUsername());
            dto.setRole(employee.getRole());
            dto.setActive(employee.isActive());
            dto.setOnShift(employee.isOnShift());

            List<CustomerOrder> employeeOrders =  orderRepository.findByAssignedWaiterUsername(dto.getUsername());

            BigDecimal employeTotalSales = BigDecimal.ZERO;
            Integer employeeTotalItems = 0;
            Integer employeeTotalOrders = employeeOrders.size();

            List<EmployeeOrderInfoResponse> orderInfo = new ArrayList<>();

            for (CustomerOrder order: employeeOrders) {
                EmployeeOrderInfoResponse orderDto = new EmployeeOrderInfoResponse();

                BigDecimal total = BigDecimal.ZERO;

                Integer totalItems = 0;

                for (OrderItem item : order.getItems()) {
                    BigDecimal itemTotal = item.getMenuItem().getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    total = total.add(itemTotal);
                    totalItems += item.getQuantity();
                }

                orderDto.setOrderTotal(total);
                orderDto.setOrderDateTime(LocalDateTime.ofInstant(order.getCreatedAt(), ZoneId.systemDefault()));
                orderDto.setStatus(order.getStatus());
                orderDto.setNumberOfItems(totalItems);

                employeTotalSales.add(total);
                employeeTotalItems += (totalItems);

                orderInfo.add(orderDto);
            }

            dto.setEmployeeOrders(orderInfo);


            response.add(dto);
        }

        return response;

    }
}
