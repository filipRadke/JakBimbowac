
function ScheduleView() {
    return (
        <div>
            <h2 className="text-xl mb-4">Rozkład jazdy</h2>

            <select className="border p-2 mb-4 w-full">
                <option>Wybierz przystanek</option>
            </select>

            <ul className="space-y-2">
                <li>Linia 1 – 12:05</li>
                <li>Linia 2 – 12:10</li>
                <li>Linia 3 – 12:15</li>
            </ul>
        </div>
    );
}
export default ScheduleView;