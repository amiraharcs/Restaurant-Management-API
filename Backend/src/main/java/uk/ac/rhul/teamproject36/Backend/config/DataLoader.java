

@Component
public class DataLoader implements CommandLineRunner {
  
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  
  public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }
  
  @Override
  public void run (String[] args) {
    if (userRepository.count() = 0) {
      User staff = new User();
      staff.setUsername("staff");
      staff.setPassword(passwordEncoder.encode("staffPass"));
      staff.setRole("roleStaff");
      
      User admin = new User();
      admin.setUsername("admin");
      admin.setPassword(passwordEncoder.encode("adminPass"));
      admin.setRole("roleAdmin");
      
      userRepository.save(staff);
      userRepository.save(admin);
    }
  }
  
}