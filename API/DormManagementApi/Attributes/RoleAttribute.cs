using DormManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace DormManagementApi.Attributes
{
    public class RoleAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private readonly RoleLevel _requiredLevel;

        public RoleAttribute(RoleLevel requiredLevel)
        {
            _requiredLevel = requiredLevel;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (user.Identity == null || !user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var roleLevelClaim = user.FindFirst(ClaimTypes.Role);
            if (roleLevelClaim == null || !Enum.TryParse<RoleLevel>(roleLevelClaim.Value, out var roleLevel) || roleLevel < _requiredLevel)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
