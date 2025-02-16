using SkiaSharp;
using SkiaSharp.Views.Maui;
using MauiCanvasCore.Services;

namespace MauiCanvasCore
{
    public partial class MainPage : ContentPage
    {
        private readonly ParticleService ParticleService;
        private readonly System.Timers.Timer PaintTimer;
        private (float x, float y) CanvasScale = (0, 0);
        private (float x, float y, float r) Cursor = (0, 0, 10);
        private readonly SKPaint ParticlePaint = new()
        {
            Color = SKColors.White,
            IsAntialias = false,
            Style = SKPaintStyle.Fill
        };
        private readonly SKPaint CursorPaint = new()
        {
            Color = SKColors.Red,
            IsAntialias = true,
            Style = SKPaintStyle.Stroke,
            StrokeWidth = 2
        };

        public MainPage(ParticleService particleService)
        {
            InitializeComponent();
            this.ParticleService = particleService;
            PaintTimer = new(20);
            PaintTimer.Elapsed += (sender, args) => MainThread.BeginInvokeOnMainThread(InvalidateCanvas);
            PaintTimer.Start();
        }

        private void OnPaintSurface(object sender, SKPaintSurfaceEventArgs args)
        {
            var canvas = args.Surface.Canvas;
            canvas.Clear(SKColors.Black);
            CanvasScale = (args.Info.Width / 1200f, args.Info.Height / 600f);

            var cellWidth = CanvasScale.x;
            var cellHeight = CanvasScale.y;

            canvas.DrawPoints(
                SKPointMode.Points,
                ParticleService.GetParticles.Select(p => new SKPoint(cellWidth * p.X, cellHeight * p.Y)).ToArray(),
                ParticlePaint
            );
            canvas.DrawCircle(cellWidth * Cursor.x, cellHeight * Cursor.y, Cursor.r, CursorPaint);
        }

        private void OnTouch(object sender, SKTouchEventArgs args)
        {
            if (args.ActionType == SKTouchAction.Moved)
            {
                Cursor.x = args.Location.X / CanvasScale.x;
                Cursor.y = args.Location.Y / CanvasScale.y;
            }
            if (args.ActionType == SKTouchAction.WheelChanged)
            {
                Cursor.r = Math.Clamp(Cursor.r + args.WheelDelta / 10, 2, 100);
            }
            if ((args.ActionType == SKTouchAction.Pressed || args.ActionType == SKTouchAction.Moved))
            {
                var particleX = (int)(args.Location.X / CanvasScale.x);
                var particleY = (int)(args.Location.Y / CanvasScale.y);
                var radius = (int)(2 * Cursor.r / (CanvasScale.x + CanvasScale.y));
                if (args.MouseButton == SKMouseButton.Left)
                {
                    ParticleService.AddParticles((x: particleX, y: particleY), radius);
                }
                if (args.MouseButton == SKMouseButton.Right)
                {
                    ParticleService.EraseParticles((x: particleX, y: particleY), radius);
                }
            }
        }

        private void StartSimulation(object sender, EventArgs e)
        {
            ParticleService.Start();
        }

        private void StopSimulation(object sender, EventArgs e)
        {
            ParticleService.Stop();
        }

        private void InvalidateCanvas()
        {
            MainThread.BeginInvokeOnMainThread(() => CanvasView.InvalidateSurface());
        }
    }
}
