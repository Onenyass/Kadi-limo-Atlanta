export function BookingSteps({ dark = false }: { dark?: boolean }) {
  return (
    <ol className={`steps${dark ? " steps--dark" : ""}`}>
      <li>
        <h3>Share your trip</h3>
        <p>
          Tell us the date, pickup time, locations, number of passengers and the kind of vehicle
          you have in mind.
        </p>
      </li>
      <li>
        <h3>We check availability</h3>
        <p>
          We review the details and reply with the vehicles available for your date and a quote
          for the trip.
        </p>
      </li>
      <li>
        <h3>Confirm and ride</h3>
        <p>
          Once you’re happy with the plan, we confirm your booking. Nothing is reserved until we
          both agree on the details.
        </p>
      </li>
    </ol>
  );
}
