using System.Diagnostics;
using NumericTypes;

var stopWatch = new Stopwatch();

stopWatch.Start();
for (int i = 0; i < 10_000_000; i++)
{
    float first = i;
    float second = 2 * i + 1;
    float result = first / second;
}
stopWatch.Stop();
var floatTime = stopWatch.Elapsed; // ~30ms

stopWatch.Start();
for (int i = 0; i < 10_000_000; i++)
{
    int first = i;
    int second = 2 * i + 1;
    int result = (first / second);
}
stopWatch.Stop();
var intTime = stopWatch.Elapsed; // ~50ms

stopWatch.Start();
for (int i = 0; i < 10_000_000; i++)
{
    decimal first = i;
    decimal second = 2 * i + 1;
    decimal result = (first / second);
}
stopWatch.Stop();
var decimalTime = stopWatch.Elapsed; // ~730ms

stopWatch.Start();
//Random randomFactory = new();
for (int i = 0; i < 10_000_000; i++)
{
    //var next = randomFactory.Next(-1, i);
    var next = Random.Shared.Next(-1, i);
}
stopWatch.Stop(); 
var randTime = stopWatch.Elapsed; // ~790ms

stopWatch.Start();
var lcgGenerator = new LinearCongruentialGenerator(13424);
for (int i = 0; i < 10_000_000; i++)
{
    var next = lcgGenerator.Next(-1, i);
}
stopWatch.Stop(); 
var lcgTime = stopWatch.Elapsed; // ~790ms


Console.WriteLine(@$"
Float time: {floatTime.TotalMilliseconds} ms
Int time: {intTime.TotalMilliseconds} ms
Decimal time: {decimalTime.TotalMilliseconds} ms
Rand time: {randTime.TotalMilliseconds} ms
Linear Congruential Generator  time: {lcgTime.TotalMilliseconds} ms
");

Console.ReadKey();
