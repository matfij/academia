namespace MauiBlazor.Tasks;

using System.Text.Json;

public class TaskService
{
    string file = string.Empty;

    public TaskService()
    {
        file = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "tasks.json"
        );
    }

    public void Save(IEnumerable<TaskItem> tasks)
    {
        File.WriteAllText(file, JsonSerializer.Serialize(tasks));
    }

    public IEnumerable<TaskItem> Load()
    {
        if (!File.Exists(file))
        {
            return [];
        }
        var tasksData = File.ReadAllText(file);
        return JsonSerializer.Deserialize<IEnumerable<TaskItem>>(tasksData) ?? [];
    }

    public TaskItem GetSampleTask()
    {
        return new TaskItem { Title = "Sample", IsDone = true };
    }
}