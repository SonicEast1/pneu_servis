import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-orange-500/20 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                PneuServis
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Rychlé odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-block">
                  Domů
                </Link>
              </li>
              <li>
                <Link href="/recenze" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-block">
                  Recenze
                </Link>
              </li>
              <li>
                <Link href="/rezervace" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-block">
                  Rezervace
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-block">
                  Galerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Naše služby</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Výměna pneumatik</li>
              <li>Vyvážení kol</li>
              <li>Uskladnění pneu</li>
              <li>Oprava pneumatik</li>
              <li>Prodej pneumatik</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start space-x-2">
                <span>📍</span>
                <span>Lorem Ipsum 123<br />123 45 Praha</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <a href="tel:+420123456789" className="hover:text-orange-500 transition-colors">
                  +420 123 456 789
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>✉️</span>
                <a href="mailto:info@pneuservis.cz" className="hover:text-orange-500 transition-colors">
                  info@pneuservis.cz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PneuServis. Všechna práva vyhrazena.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
              Ochrana údajů
            </Link>
            <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
              Podmínky
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

