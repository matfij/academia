namespace MauiBlazor.Data;

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

    public void Save(IEnumerable<Data.Task> tasks)
    {
        File.WriteAllText(file, JsonSerializer.Serialize(tasks));
    }

    public IEnumerable<Data.Task> Load()
    {
        if (!File.Exists(file))
        {
            return [];
        }
        var tasksData = File.ReadAllText(file);
        return JsonSerializer.Deserialize<IEnumerable<Data.Task>>(tasksData) ?? [];
    }
}

