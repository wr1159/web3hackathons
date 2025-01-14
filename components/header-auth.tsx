import { signOutAction } from "@/app/actions";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user ? (
        <div className="flex items-center gap-4">
            Hey, {user.email}!
            <form action={signOutAction}>
                <Button type="submit" variant={"outline"}>
                    Sign out
                </Button>
            </form>
        </div>
    ) : (
        <div className="flex gap-2 pointer-events-none">
            <Button size="sm" variant={"outline"} disabled>
                {/* <Link href="/sign-in">Sign in</Link> */}
                Sign In
            </Button>
            <Button size="sm" variant={"default"} disabled>
                {/* <Link href="/sign-up">Sign up</Link> */}
                Sign Up
            </Button>
        </div>
    );
}
