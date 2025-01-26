using MauiBlazor.Tasks;

namespace UnitTests;

public class TaskServiceTest
{
    [Fact]
    public void ShouldGetSampleTask()
    {
        var taskService = new TaskService();

        var sample = taskService.GetSampleTask();

        Assert.NotNull(sample);
        Assert.Equal("Sample", sample.Title);
    }
}
