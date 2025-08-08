using Moq;
using NUnit.Framework;
using UserCommunication;

namespace UtilitiesTests.DiceRollGameTests;

[TestFixture]
internal class ConsoleUserCommunicationTest
{
    private const string _defaultPrompt = "Enter a valid number";

    private Mock<IConsole> _consoleMock;
    private ConsoleUserCommunication _cut;

    [SetUp]
    public void Setup()
    {
        _consoleMock = new Mock<IConsole>();
        _cut = new ConsoleUserCommunication(_consoleMock.Object);
    }

    [TestCase("1", 1)]
    [TestCase("99", 99)]
    [TestCase("-5", -5)]
    [TestCase("0", 0)]
    public void ReadInteger_ShouldReturnCorrectInteger_ForValidInput(string input, int expected)
    {
        _consoleMock.Setup(m => m.ReadLine()).Returns(input);

        var result = _cut.ReadInteger(_defaultPrompt);

        Assert.AreEqual(expected, result);
    }

    [TestCase("Hello there")]
    [TestCase("Gimme a number")]
    [TestCase("Roll a dice")]
    public void ReadInteger_ShouldPrintCorrectPrompt_ForValidInput(string prompt)
    {
        _consoleMock.Setup(m => m.ReadLine()).Returns("0");

        _cut.ReadInteger(prompt);

        _consoleMock.Verify(mock => mock.WriteLine(It.Is<string>(input => input == prompt)), Times.Once());
    }

    [Test]
    public void ReadInteger_ShouldWaitForCorrectInput_ForTemporarilyInvalidInput()
    {
        _consoleMock.SetupSequence(m => m.ReadLine())
            .Returns("abc")
            .Returns("x")
            .Returns("")
            .Returns("no soup for you!")
            .Returns("5");

        var result = _cut.ReadInteger(_defaultPrompt);

        Assert.AreEqual(5, result);
    }

    [Test]
    public void ShowMessage_ShouldCallUnderlyingConsole_ForValidInput()
    {
        _consoleMock.Setup(m => m.ReadLine()).Returns("0");

        var result = _cut.ReadInteger(_defaultPrompt);

        _consoleMock.Verify(mock => mock.WriteLine(It.Is<string>(input => input == _defaultPrompt)), Times.Once());
    }
}
