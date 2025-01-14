# Web3Hackathons

The one stop for all the Web3Hackathons

## Features

- View all Web3Hackathons
    - Card View
    - Table View
    - Calendar View (⬇️)
- Submit Requests for Web3Hackathons (⬇️)
- Submit Feature Requests (⬇️)
- Login to Track your Hackathons (⬇️)
    - Wallet
    - Gmail

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

    ```bash
    npx create-next-app --example with-supabase with-supabase-app
    ```

    ```bash
    yarn create next-app --example with-supabase with-supabase-app
    ```

    ```bash
    pnpm create next-app --example with-supabase with-supabase-app
    ```

3. Use `cd` to change into the app's directory

    ```bash
    cd with-supabase-app
    ```

4. Rename `.env.example` to `.env.local` and update the following:

    ```
    NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
    NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
    ```

    Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

    ```bash
    npm run dev
    ```

    The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.
