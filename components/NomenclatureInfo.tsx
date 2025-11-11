'use client';

export default function NomenclatureInfo() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Nomenklatur Net Revenue</h2>
      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <p className="font-semibold text-gray-900 mb-1">auto_crm</p>
          <p>15 Min pro Übersetzung</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 mb-1">fluentia_code</p>
          <p>Manuelle Erstellung dauert 120 Sekunden pro Code.</p>
          <p>Stundenlohnannahme: 35 €/h</p>
          <p>Gesamtersparnis = Anzahl automatisierter Codes x 0,996 €.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 mb-1">dco</p>
          <p>Annahme: Erstellung eines Assets dauert 10 Minuten.</p>
          <p>Stundenlohn beträgt 35 Euro.</p>
          <p>Berechnete Kosten pro Asset: 8,75 Euro</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 mb-1">fluentia_email_board</p>
          <p>E-Mails, die nicht manuell beantwortet werden müssen, werden berechnet.</p>
          <p>Die Berechnung erfolgt mit 35 €/h auf Basis von 5 Minuten pro E-Mail.</p>
          <p>Das entspricht 2,92 € pro E-Mail.</p>
        </div>
      </div>
    </div>
  );
}

