import { signOutAction } from "@/app/actions/auth.actions";

export function StaffAccessDenied() {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100/90">
      <p className="font-medium text-white">Нет доступа к админке</p>
      <p className="mt-2 text-neutral-300">
        Учётная запись не привязана к ресторану. Обратитесь к владельцу или
        выполните SQL bootstrap для таблицы <code className="text-neutral-400">staff</code>.
      </p>
      <form action={signOutAction} className="mt-4">
        <button
          type="submit"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Выйти
        </button>
      </form>
    </div>
  );
}
