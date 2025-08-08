using Game;
using Moq;
using NUnit.Framework;
using UserCommunication;

namespace UtilitiesTests.DiceRollGameTests;

[TestFixture]
internal class GuessingGameTest
{
    private Mock<IDice> _diceMock;
    private Mock<IUserCommunication> _userCommunicationMock;
    private GuessingGame _cut;

    [SetUp]
    public void Setup()
    {
        _diceMock = new Mock<IDice>();
        _userCommunicationMock = new Mock<IUserCommunication>();
        _cut = new GuessingGame(_diceMock.Object, _userCommunicationMock.Object);

        _diceMock
            .Setup(mock => mock.Roll())
            .Returns(3);
    }

    [Test]
    public void Play_ShallReturnLoseResult_WhenDiceResultNotGuessed()
    {
        _userCommunicationMock
            .SetupSequence(mock => mock.ReadInteger("Provide int"))
            .Returns(1)
            .Returns(1)
            .Returns(1);

        var result = _cut.Play();

        Assert.AreEqual(GameResult.Loss, result);
    }

    [Test]
    public void Play_ShallReturnVictoryResult_WhenDiceResultIsGuessed()
    {
        _userCommunicationMock
            .SetupSequence(mock => mock.ReadInteger(It.IsAny<string>()))
            .Returns(1)
            .Returns(3);

        var result = _cut.Play();

        Assert.AreEqual(GameResult.Victory, result);
    }

    [Test]
    public void Play_ShallPrintCorrectInitialMessage()
    {
        _userCommunicationMock
            .SetupSequence(mock => mock.ReadInteger(It.IsAny<string>()))
            .Returns(1)
            .Returns(3);

        _cut.Play();

        var invocations = _userCommunicationMock.Invocations;

        Assert.That(invocations[0].Method.Name, Is.EqualTo(nameof(IUserCommunication.ShowMessage)));
        Assert.That(invocations[0].Arguments[0], Is.EqualTo("Dice rolled. Guess what number it shows in 3 tries."));
    }

    [Test]
    public void Play_ShallPrintCorrectMessageToRequestInput()
    {
        _userCommunicationMock
            .SetupSequence(mock => mock.ReadInteger(It.IsAny<string>()))
            .Returns(1)
            .Returns(3);

        _cut.Play();

        var invocations = _userCommunicationMock.Invocations;

        Assert.That(invocations[1].Method.Name, Is.EqualTo(nameof(IUserCommunication.ReadInteger)));
        Assert.That(invocations[1].Arguments[0], Is.EqualTo("Enter a number:"));
        Assert.That(invocations[2].Method.Name, Is.EqualTo(nameof(IUserCommunication.ShowMessage)));
        Assert.That(invocations[2].Arguments[0], Is.EqualTo("Wrong number."));
    }

    [TestCase(GameResult.Victory, "You won!")]
    [TestCase(GameResult.Loss, "You lost :(")]
    public void PrintResult_ShouldPrintCorrectResult_ForSpecificGameResult(GameResult result, string expectedMessage)
    {
        _cut.PrintResult(result);

        _userCommunicationMock.Verify(mock => mock.ShowMessage(expectedMessage), Times.Once());
    }

}
