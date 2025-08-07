using Moq;
using NUnit.Framework;
using Utilities;

namespace UtilitiesTests.UtilitiesTests;

[TestFixture]
public class UserManagerTest
{
    private UserManager _userManager;
    private Mock<IUserRepository> _mockRepository;

    private bool IsGuid(string id) => Guid.TryParse(id, out _);

    [SetUp]
    public void Setup()
    {
        _mockRepository = new Mock<IUserRepository>();
        _userManager = new UserManager(_mockRepository.Object);
    }

    [TearDown]
    public void Teardown()
    {
        _mockRepository.Reset();
    }

    [Test]
    public void ReadById_ShallReturnUser_ForValidUserId()
    {
        _mockRepository
            .SetupSequence(mock => mock.ReadById(It.IsAny<string>()))
            .Returns("Mat Fij")
            .Returns("Jon Art")
            .Returns("Sam Tru")
            .Throws(new Exception("Out of people"));

        var result = _userManager.ReadById("m-f");

        Assert.AreEqual("Mat Fij", result);
    }

    [Test]
    public void Save_ShallCallRepositoryWithCorrectArgument_ForValidInput()
    {
        var id = Guid.NewGuid().ToString();
        var name = "Samuel Jackson";

        _userManager.Save(id, name);

        _mockRepository.Verify(
            mock => mock.Save(It.Is<string>(id => IsGuid(id)), name),
            Times.Once());
    }
}
