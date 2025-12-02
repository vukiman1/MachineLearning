export function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border px-10 py-3 fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="flex items-center gap-4">
        <div className="size-8 text-blue-600">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight">ML Learning Hub</h2>
      </div>
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6">
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Khóa học
          </a>
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Cộng đồng
          </a>
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Tài nguyên
          </a>
        </nav>
      </div>
    </header>
  )
}
