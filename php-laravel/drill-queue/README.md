## Commands

-   start server: `php artisan serve`
-   list routes: `php artisan route:list`
-   apply migrations: `php artisan migrate`
-   rollback migrations: `php artisan migrate:rollback`
-   seed dummy data into db: `php artisan db:seed`
-   reset db state and seed: `php artisan migrate:refresh --seed`

## Directives

-   @csrf - protects agains cross-site request forgery in which attacker tricks the
    authenticated user (active session) to send a request to this website endpoint by generating
    a CSRF token and adding it to form data. Required for secure forms.
