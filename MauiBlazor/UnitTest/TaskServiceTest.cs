using MauiBlazor.Data;
using Xunit;

namespace UnitTest
{
    public class TaskServiceTest
    {
        [Fact]
        public void GetSampleTaskShouldReturnCorrectTask()
        {
            var service = new TaskService();

            var sampleTask = service.GetSampleTask();

            Assert.NotNull(sampleTask);
            Assert.Equal("Sample", sampleTask.Title);
            Assert.True(sampleTask.IsDone);
        }
    }
}