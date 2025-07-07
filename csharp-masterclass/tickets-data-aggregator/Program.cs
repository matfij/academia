using TicketsDataAggregator;


ITicketsReader reader = new PdfTicketsReader();

var content = reader.ReadAll();

Console.WriteLine(content);

Console.ReadLine();
