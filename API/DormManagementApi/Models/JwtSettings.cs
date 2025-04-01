namespace DormManagementApi.Models
{
    public class JwtSettings
    {
        public const long ExpirationTimeHours = 24 * 7; // 1 week
        public string? Secret { get; set; }
    }
}
