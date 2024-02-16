using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

// data-driven code (configuration)
namespace CSBasics
{
    internal enum FileAction
    {
        Delete,
        Backup,
        Ignore
    }

    internal class Patterns
    {
        private static void ProcessItems(FileSystemInfo file)
        {
            var action = GetItemIction(file);
            ProcessItem(action, file);
        }

        // pattern matching (with switch expression), only for const values
        private static FileAction GetItemIction(FileSystemInfo file)
        {
            const int MAX_SIZE = 104_857_600; // 100 MB
            return file switch
            {
                DirectoryInfo { Name: "bin" or "obj" } => FileAction.Delete,
                DirectoryInfo { Name: ".git" } => FileAction.Ignore,
                FileInfo { Name: ".tmp" } => FileAction.Ignore,
                FileInfo { Length: > MAX_SIZE } => FileAction.Ignore,
                _ => FileAction.Backup,
            };
        }

        private static void ProcessItem(FileAction action, FileSystemInfo file)
        {
            Console.WriteLine(action.ToString(), file.FullName);
        }
    }

    // dynamic configuraiton (json)
    public class BackupRules
    {
        public List<string> IgnoreDirNames { get; init; }
        public List<string> DeleteDirNames { get; init; }
        public List<string> IgnoreFileNames { get; init; }
        public List<string> DeleteFileNames { get; init; }
        public int? IgnoreMinSize { get; init; }

        public BackupRules(List<string> ignoreDirNames, List<string> deleteDirNames, List<string> ignoreFileNames, List<string> deleteFileNames, int? ignoreMinSize)
        {
            IgnoreDirNames = ignoreDirNames;
            DeleteDirNames = deleteDirNames;
            IgnoreFileNames = ignoreFileNames;
            DeleteFileNames = deleteFileNames;
            IgnoreMinSize = ignoreMinSize;
        }

        // pattern matching - is clauses
        public FileAction GetItemAction(FileSystemInfo item)
        {
            if (item is FileInfo fileInfo)
            {
                if (IgnoreFileNames.Contains(item.Name, StringComparer.OrdinalIgnoreCase))
                    return FileAction.Ignore;
                if (DeleteFileNames.Contains(item.Name, StringComparer.OrdinalIgnoreCase))
                    return FileAction.Delete;
                if (IgnoreMinSize != null && fileInfo.Length > IgnoreMinSize)
                    return FileAction.Ignore;
            }
            else if (item is DirectoryInfo)
            {
                if (IgnoreDirNames.Contains(item.Name, StringComparer.OrdinalIgnoreCase))
                    return FileAction.Ignore;
                if (DeleteDirNames.Contains(item.Name, StringComparer.OrdinalIgnoreCase))
                    return FileAction.Delete;
            }
            return FileAction.Backup;
        }

        public static class BackupRulesSerializer
        {
            public static BackupRules DeserializeFromJson()
            {
                string json = File.ReadAllText(GetJsonFilePath());
                JsonSerializerOptions options = new JsonSerializerOptions();
                options.WriteIndented = true;
                return JsonSerializer.Deserialize<BackupRules>(json, options)!;
            }

            private static string GetJsonFilePath()
            {
                string exeFolder = Assembly.GetEntryAssembly()!.Location!;
                DirectoryInfo info = new DirectoryInfo(exeFolder);
                while (info.Name != "bin")
                {
                    if (info.Parent == null)
                        throw new Exception("Not found");
                    info = info.Parent;
                }
                string folder = Path.Combine(info.Parent!.FullName, "BusinessRules");
                return Path.Combine(folder, "rules.json");
            }


            public static void InitializeFile()
            {
                BackupRules fileRules = new BackupRules(
                    new List<string> { ".hg" },
                    new List<string> { "bin", "obj" },
                    new List<string> { ".hgignore" },
                    new List<string>(), 104_857_600 // 100 MB
                    );
                BackupRulesSerializer.SerializeToJson(fileRules);
            }

            private static void SerializeToJson(BackupRules rules)
            {
                JsonSerializerOptions options = new JsonSerializerOptions();
                options.WriteIndented = true;
                string str = JsonSerializer.Serialize(rules, options);
                File.WriteAllText(GetJsonFilePath(), str);
            }

            public static class DirectoryCleaner
            {
                public static void DoBackupAndClean(DirectoryInfo targetDirectory, BackupRules backupRules)
                {
                    foreach (FileSystemInfo item in targetDirectory.EnumerateFileSystemInfos())
                    {
                        FileAction action = backupRules.GetItemAction(item);
                        ProcessItem(action, item);
                    }
                }

                private static void ProcessItem(FileAction fileAction, FileSystemInfo item) =>
                    Console.WriteLine($"{fileAction}: {item.Name}");

            }
        }
    }
}
