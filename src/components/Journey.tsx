/** How a request becomes a ride: three stops on a route. */
export function Journey() {
  const steps = [
    {
      title: "Share your trip",
      body: "Tell us the date, pickup time, locations, number of passengers and the vehicle you have in mind.",
    },
    {
      title: "We check availability",
      body: "We review the details and reply with the vehicles available for your date and a quote for the trip.",
    },
    {
      title: "Confirm and ride",
      body: "Once you’re happy with the plan, we confirm your booking. Nothing is reserved until we both agree.",
    },
  ];
  return (
    <ol className="journey">
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className="journey__num">Stop 0{i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
