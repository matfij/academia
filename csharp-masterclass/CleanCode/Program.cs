// boy scout rule - leave code a bit better than it was before,
// big refactor may not com soon

// principle of least surprise - functions should do what they name suggests

using CleanCode;

var rand = new QuickRandomGenerator();
var passwordGenerator = new PasswordGenerator(rand);

for (int i = 0; i < 10; i++)
{
    Console.WriteLine(passwordGenerator.Generate(5, 10));
    Console.WriteLine(passwordGenerator.GenerateSpecial(1, 20));
}
Console.ReadKey();
