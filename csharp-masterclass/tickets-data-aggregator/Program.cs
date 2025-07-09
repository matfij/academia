using TicketsDataAggregator;

string _format = "*.pdf";
string _path = @"C:\Users\mateu\Downloads\Tickets\Tickets";

ITicketsReader reader = new PdfTicketsReader();
ITicketsParser parser = new TextTicketsParser();

var fileEntries = Directory.GetFiles(_path, _format);
var allTickets = new List<Ticket>();

foreach (var entry in fileEntries)
{
    var content = reader.Read(entry);
    var tickets = parser.Parse(content);
    allTickets.AddRange(tickets);
}

foreach (var ticket in allTickets)
{
    Console.WriteLine(ticket);
}

Console.ReadLine();
