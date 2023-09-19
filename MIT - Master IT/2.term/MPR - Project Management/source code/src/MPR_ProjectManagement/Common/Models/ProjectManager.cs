namespace Common.Models
{
    public class ProjectManager : Employee
    {
        //TODO move method where it fits
        public IEnumerable<Project> Projects () => new List<Project> ();
    }
}