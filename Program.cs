using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseDefaultFiles(); 
app.UseStaticFiles(); 

using (var db = new AppDbContext())
{
    db.Database.EnsureCreated();  // создаст .db файл и таблицы
}
app.MapPost("/deletetask", (DeleteRequest request) =>
{
    using (var db = new AppDbContext())
    {
        var task = db.Tasks.FirstOrDefault(t => t.Id == request.Id);
        if (task != null)
        {
            db.Tasks.Remove(task);
            db.SaveChanges();
        }
    }
    return "Удалено";
});

app.MapPost("/test", (GetID id) =>
{
    TodoTask currentTask;
    using (var db = new AppDbContext())
    {
        currentTask = db.Tasks.FirstOrDefault(t => t.Id == id.Id);
    }
    return Results.Json(currentTask);
});
app.MapPost("/sendData", (GetData data) =>
{
    using (var db = new AppDbContext())
    {
        var NewTask = new TodoTask{Name = data.Name, Description = data.Desc};
        if(NewTask.Name.Length == 0) NewTask.Name = "Название задачи отсутствует";
        if(NewTask.Description.Length == 0) NewTask.Description = "Описание задачи отсутствует";
        db.Tasks.Add(NewTask);
        db.SaveChanges();
    }
    return "Задача успешно добавлена!";
});
app.MapGet("/delalltasks", () =>
{
    using (var db = new AppDbContext())
    {
        db.Tasks.RemoveRange(db.Tasks);
        db.SaveChanges();    
    }
    return "Вы удалили все задачи!";
});
app.MapPost("/sendNewData", (UpdateRequest request) =>
{
    using (var db = new AppDbContext())
    {
        // Находим задачу по ID
        var task = db.Tasks.FirstOrDefault(t => t.Id == request.Id);
        if (task == null) return "Задача не найдена";
        
        // Обновляем, если новые значения не пустые
        if (!string.IsNullOrEmpty(request.NewName))
        {
            task.Name = request.NewName;
        }
        if (!string.IsNullOrEmpty(request.NewDesc))
        {
            task.Description = request.NewDesc;
        }
        
        db.SaveChanges();
        return "Задача обновлена";
    }
});

app.MapGet("/gettasks", () =>
{
    List<TodoTask> TaskList;
    using (var db = new AppDbContext())
    {
        TaskList = db.Tasks.ToList();
    }
    return Results.Json(TaskList);
});
app.Run();
public class GetID
{
    public int Id{get; set;}
}
public class DeleteRequest
{
    public int Id { get; set; }
}
public class GetData
{
    public string Name{get; set;}
    public string Desc{get; set;}
}
public class TodoTask
{
    public int Id { get; set; }          // первичный ключ, будет авто-инкремент
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
public class UpdateRequest
{
    public int Id { get; set; }
    public string NewName { get; set; } = string.Empty;
    public string NewDesc { get; set; } = string.Empty;
}
public class AppDbContext : DbContext
{
    public DbSet<TodoTask> Tasks { get; set; }  // таблица Tasks

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // указываем, что используем SQLite, файл базы данных будет называться tasks.db
        optionsBuilder.UseSqlite("Data Source=tasks.db");
    }
}