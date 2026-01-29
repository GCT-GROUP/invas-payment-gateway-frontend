
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground py-6 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-[1350px] mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <p className="text-sm text-primary-foreground/80">© {currentYear} inVAS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
