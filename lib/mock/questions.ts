import type { Choice, Question } from "../types";

/**
 * ORIGINAL PLACEHOLDER CONTENT.
 *
 * Every stem, passage, answer choice and explanation below was written for this
 * project. Nothing here is copied, adapted or paraphrased from the College
 * Board, Khan Academy, Barron's or any other publisher. Named researchers,
 * authors, places and studies are invented. Domain and skill labels are factual
 * taxonomy names and carry no content.
 *
 * Math notation uses a small convention read by `<MathExpression>`:
 * single Latin letters render italic, `^` introduces a superscript, and
 * `^(...)` groups a multi-character superscript.
 */

/** Builds the four choices for a multiple-choice question. */
function mc(id: string, a: string, b: string, c: string, d: string): Choice[] {
  return [
    { id: `${id}-a`, label: "A", text: a },
    { id: `${id}-b`, label: "B", text: b },
    { id: `${id}-c`, label: "C", text: c },
    { id: `${id}-d`, label: "D", text: d },
  ];
}

const ALGEBRA: Question[] = [
  {
    id: "m-alg-01",
    section: "math",
    domain: "Algebra",
    skill: "Linear equations in one variable",
    difficulty: "easy",
    type: "multiple_choice",
    expression: "5x − 8 = 2x + 7",
    stem: "What is the solution to the given equation?",
    choices: mc("m-alg-01", "−5", "1", "5", "15"),
    correctAnswer: "m-alg-01-c",
    explanation:
      "Subtract 2x from both sides to get 3x − 8 = 7. Add 8 to both sides to get 3x = 15, then divide both sides by 3 to get x = 5.",
    estimatedTimeSeconds: 45,
  },
  {
    id: "m-alg-02",
    section: "math",
    domain: "Algebra",
    skill: "Linear functions",
    difficulty: "medium",
    type: "multiple_choice",
    expression: "f(x) = −3x + 14",
    stem: "The function f is defined by the given equation. What is the value of f(−2)?",
    choices: mc("m-alg-02", "8", "11", "20", "26"),
    correctAnswer: "m-alg-02-c",
    explanation:
      "Substitute −2 for x: f(−2) = −3(−2) + 14 = 6 + 14 = 20. A common error is treating −3(−2) as −6, which gives 8.",
    estimatedTimeSeconds: 50,
  },
  {
    id: "m-alg-03",
    section: "math",
    domain: "Algebra",
    skill: "Systems of two linear equations",
    difficulty: "medium",
    type: "multiple_choice",
    expression: "x + 2y = 11\n3x − 2y = 9",
    stem: "The given system of equations has solution (x, y). What is the value of x + y?",
    choices: mc("m-alg-03", "2", "5", "8", "15"),
    correctAnswer: "m-alg-03-c",
    explanation:
      "Adding the two equations eliminates y: 4x = 20, so x = 5. Substituting into the first equation gives 5 + 2y = 11, so y = 3. Therefore x + y = 8.",
    estimatedTimeSeconds: 75,
  },
  {
    id: "m-alg-04",
    section: "math",
    domain: "Algebra",
    skill: "Linear inequalities",
    difficulty: "medium",
    type: "multiple_choice",
    expression: "−4x + 9 ≥ 25",
    stem: "Which inequality represents all solutions to the given inequality?",
    choices: mc("m-alg-04", "x ≤ −4", "x ≥ −4", "x ≤ 4", "x ≥ 4"),
    correctAnswer: "m-alg-04-a",
    explanation:
      "Subtract 9 from both sides to get −4x ≥ 16. Dividing both sides by −4 reverses the inequality sign, giving x ≤ −4.",
    estimatedTimeSeconds: 60,
  },
  {
    id: "m-alg-05",
    section: "math",
    domain: "Algebra",
    skill: "Linear equations in two variables",
    difficulty: "hard",
    type: "student_produced_response",
    stem: "Line ℓ passes through the points (−3, 8) and (5, −4) in the xy-plane. What is the y-coordinate of the y-intercept of line ℓ?",
    choices: [],
    correctAnswer: "3.5",
    acceptedAnswers: ["3.5", "7/2"],
    explanation:
      "The slope is (−4 − 8) / (5 − (−3)) = −12/8 = −3/2. Using the point (−3, 8): y − 8 = −3/2(x + 3). At x = 0, y = 8 − 9/2 = 7/2 = 3.5.",
    estimatedTimeSeconds: 110,
  },
  {
    id: "m-alg-06",
    section: "math",
    domain: "Algebra",
    skill: "Systems of two linear equations",
    difficulty: "hard",
    type: "multiple_choice",
    expression: "kx − 6y = 10\n4x + 3y = −7",
    stem: "In the given system of equations, k is a constant. If the system has no solution, what is the value of k?",
    choices: mc("m-alg-06", "−8", "−2", "2", "8"),
    correctAnswer: "m-alg-06-a",
    explanation:
      "A system of two linear equations has no solution when the lines are parallel, meaning equal slopes and different intercepts. Writing each equation in slope-intercept form gives y = (k/6)x − 5/3 and y = −(4/3)x − 7/3. Setting k/6 = −4/3 gives k = −8.",
    estimatedTimeSeconds: 120,
  },
];

const ADVANCED_MATH: Question[] = [
  {
    id: "m-adv-01",
    section: "math",
    domain: "Advanced Math",
    skill: "Equivalent expressions",
    difficulty: "easy",
    type: "multiple_choice",
    expression: "(3x^2 + 5x − 2) − (x^2 − 4x + 6)",
    stem: "Which expression is equivalent to the given expression?",
    choices: mc(
      "m-adv-01",
      "2x^2 + x + 4",
      "2x^2 + 9x − 8",
      "2x^2 + 9x + 4",
      "4x^2 + x − 8",
    ),
    correctAnswer: "m-adv-01-b",
    explanation:
      "Distribute the subtraction across the second group: 3x² + 5x − 2 − x² + 4x − 6. Combining like terms gives 2x² + 9x − 8. Forgetting to distribute the minus sign to every term is the usual error.",
    estimatedTimeSeconds: 60,
  },
  {
    id: "m-adv-02",
    section: "math",
    domain: "Advanced Math",
    skill: "Nonlinear equations in one variable",
    difficulty: "medium",
    type: "multiple_choice",
    expression: "x^2 − 10x + 21 = 0",
    stem: "What is the positive difference between the two solutions to the given equation?",
    choices: mc("m-adv-02", "3", "4", "7", "10"),
    correctAnswer: "m-adv-02-b",
    explanation:
      "The expression factors as (x − 3)(x − 7) = 0, so the solutions are x = 3 and x = 7. Their positive difference is 7 − 3 = 4. Their sum, 10, is a distractor.",
    estimatedTimeSeconds: 70,
  },
  {
    id: "m-adv-03",
    section: "math",
    domain: "Advanced Math",
    skill: "Nonlinear functions",
    difficulty: "medium",
    type: "multiple_choice",
    expression: "g(x) = (x − 4)^2 − 9",
    stem: "The function g is defined by the given equation. For what value of x does g reach its minimum?",
    choices: mc("m-adv-03", "−9", "−4", "4", "9"),
    correctAnswer: "m-adv-03-c",
    explanation:
      "The equation is in vertex form, so the vertex is at (4, −9). Because the squared term is never negative, g is smallest when (x − 4)² = 0, that is, when x = 4. The value −9 is the minimum output, not the input.",
    estimatedTimeSeconds: 75,
  },
  {
    id: "m-adv-04",
    section: "math",
    domain: "Advanced Math",
    skill: "Equivalent expressions",
    difficulty: "hard",
    type: "student_produced_response",
    expression: "(2x^2 + 7x − 15) / (x + 5)",
    stem: "For x ≠ −5, the given expression is equivalent to 2x + c, where c is a constant. What is the value of c?",
    choices: [],
    correctAnswer: "-3",
    acceptedAnswers: ["-3", "−3"],
    explanation:
      "Factor the numerator: 2x² + 7x − 15 = (x + 5)(2x − 3). Dividing by x + 5 leaves 2x − 3, so c = −3.",
    estimatedTimeSeconds: 115,
  },
  {
    id: "m-adv-05",
    section: "math",
    domain: "Advanced Math",
    skill: "Nonlinear equations in one variable",
    difficulty: "hard",
    type: "multiple_choice",
    expression: "2^(x+3) = 32^(x−1)",
    stem: "What value of x satisfies the given equation?",
    choices: mc("m-adv-05", "1", "2", "4", "8"),
    correctAnswer: "m-adv-05-b",
    explanation:
      "Write 32 as 2⁵ so the right side becomes 2^(5(x−1)) = 2^(5x−5). With equal bases the exponents must match: x + 3 = 5x − 5, so 4x = 8 and x = 2.",
    estimatedTimeSeconds: 120,
  },
  {
    id: "m-adv-06",
    section: "math",
    domain: "Advanced Math",
    skill: "Nonlinear functions",
    difficulty: "medium",
    type: "multiple_choice",
    stem: "A bacterial culture has an initial population of 400 cells, and the population doubles every 6 hours. Which equation gives the population P after t hours?",
    choices: mc(
      "m-adv-06",
      "P = 400 · 2^(6t)",
      "P = 400 · 2^(t/6)",
      "P = 400 · 6^(t/2)",
      "P = 400 + 2^(t/6)",
    ),
    correctAnswer: "m-adv-06-b",
    explanation:
      "Doubling means a growth factor of 2, and one doubling occurs per 6 hours, so the number of doublings after t hours is t/6. The model is P = 400 · 2^(t/6). Choice A doubles every 1/6 hour instead.",
    estimatedTimeSeconds: 85,
  },
];

const PROBLEM_SOLVING: Question[] = [
  {
    id: "m-psda-01",
    section: "math",
    domain: "Problem-Solving and Data Analysis",
    skill: "Ratios, rates, and proportional relationships",
    difficulty: "easy",
    type: "multiple_choice",
    stem: "A printing press produces 165 pages every 3 minutes at a constant rate. At this rate, how many pages does the press produce in 20 minutes?",
    choices: mc("m-psda-01", "495", "825", "1,100", "3,300"),
    correctAnswer: "m-psda-01-c",
    explanation:
      "The rate is 165 ÷ 3 = 55 pages per minute. In 20 minutes the press produces 55 × 20 = 1,100 pages.",
    estimatedTimeSeconds: 55,
  },
  {
    id: "m-psda-02",
    section: "math",
    domain: "Problem-Solving and Data Analysis",
    skill: "Percentages",
    difficulty: "easy",
    type: "multiple_choice",
    stem: "A jacket priced at $80.00 is discounted by 15%. A further 10% is then taken off the discounted price. What is the final price of the jacket?",
    choices: mc("m-psda-02", "$60.00", "$61.20", "$62.00", "$68.00"),
    correctAnswer: "m-psda-02-b",
    explanation:
      "The first discount gives 80 × 0.85 = $68.00. The second discount applies to $68.00, not to $80.00: 68 × 0.90 = $61.20. Adding the two percentages to get a single 25% discount gives $60.00, which is the most common error.",
    estimatedTimeSeconds: 70,
  },
  {
    id: "m-psda-03",
    section: "math",
    domain: "Problem-Solving and Data Analysis",
    skill: "One-variable data and distributions",
    difficulty: "medium",
    type: "multiple_choice",
    stem: "The table summarizes the number of books read last month by each of the 20 members of a reading group. What is the median number of books read?",
    table: {
      caption: "Books read last month by members of the reading group",
      headers: ["Books read", "Number of members"],
      rows: [
        ["0", "2"],
        ["1", "5"],
        ["2", "8"],
        ["3", "4"],
        ["4", "1"],
      ],
    },
    choices: mc("m-psda-03", "1", "1.85", "2", "2.5"),
    correctAnswer: "m-psda-03-c",
    explanation:
      "With 20 values the median is the average of the 10th and 11th values in order. The running totals are 2 members at 0 books, 7 at 1 or fewer, and 15 at 2 or fewer, so both the 10th and 11th values are 2. The median is 2. The value 1.85 is the mean.",
    estimatedTimeSeconds: 90,
  },
  {
    id: "m-psda-04",
    section: "math",
    domain: "Problem-Solving and Data Analysis",
    skill: "Two-variable data and models",
    difficulty: "medium",
    type: "multiple_choice",
    expression: "y = 2.4x + 11",
    stem: "The scatterplot shows weekly practice hours, x, and score on a 40-point diagnostic, y, for 18 students. The equation of the line of best fit is given. Based on this line, what score is predicted for a student who practices 7 hours in a week?",
    figure: {
      kind: "graph",
      alt: "Scatterplot of 18 points with weekly practice hours from 0 to 12 on the horizontal axis and diagnostic score from 0 to 40 on the vertical axis. The points rise from left to right, and a straight line of best fit passes through them.",
      caption: "Weekly practice hours and diagnostic score",
    },
    choices: mc("m-psda-04", "18.0", "25.4", "27.8", "30.2"),
    correctAnswer: "m-psda-04-c",
    explanation:
      "Substitute x = 7 into the line of best fit: y = 2.4(7) + 11 = 16.8 + 11 = 27.8.",
    estimatedTimeSeconds: 80,
  },
  {
    id: "m-psda-05",
    section: "math",
    domain: "Problem-Solving and Data Analysis",
    skill: "Probability and conditional probability",
    difficulty: "medium",
    type: "multiple_choice",
    stem: "The table shows the results of a certification exam for 200 candidates, grouped by whether they attended a preparation workshop. One candidate who passed is selected at random. What is the probability that the selected candidate attended the workshop?",
    table: {
      caption: "Certification exam results by workshop attendance",
      headers: ["", "Passed", "Did not pass", "Total"],
      rows: [
        ["Attended workshop", "84", "21", "105"],
        ["Did not attend", "46", "49", "95"],
        ["Total", "130", "70", "200"],
      ],
    },
    choices: mc("m-psda-05", "84/200", "84/105", "84/130", "130/200"),
    correctAnswer: "m-psda-05-c",
    explanation:
      "The candidate is selected from those who passed, so the denominator is the 130 candidates who passed, not all 200. Of those, 84 attended the workshop, giving 84/130. Choice B answers the reverse conditional question.",
    estimatedTimeSeconds: 85,
  },
  {
    id: "m-psda-06",
    section: "math",
    domain: "Problem-Solving and Data Analysis",
    skill: "Inference from sample statistics",
    difficulty: "hard",
    type: "multiple_choice",
    stem: "A researcher surveyed a random sample of 300 residents of a town with 24,000 residents. In the sample, 42% supported extending the public library's opening hours, with an associated margin of error of 5.6 percentage points at a 95% confidence level. Which conclusion is best supported by these results?",
    choices: mc(
      "m-psda-06",
      "Exactly 42% of all residents of the town support extending the opening hours.",
      "A majority of residents of the town support extending the opening hours.",
      "Every random sample of 300 residents of the town would produce a result between 36.4% and 47.6%.",
      "It is plausible that between 36.4% and 47.6% of all residents of the town support extending the opening hours.",
    ),
    correctAnswer: "m-psda-06-d",
    explanation:
      "A margin of error describes a plausible interval for the population value, here 42% ± 5.6%, or 36.4% to 47.6%. It does not pin the population value to the sample value (A), guarantee the result of every future sample (C), or support a claim about a majority, since the whole interval lies below 50% (B).",
    estimatedTimeSeconds: 105,
  },
];

const GEOMETRY: Question[] = [
  {
    id: "m-geo-01",
    section: "math",
    domain: "Geometry and Trigonometry",
    skill: "Area and volume",
    difficulty: "easy",
    type: "multiple_choice",
    stem: "A right circular cylinder has a radius of 5 centimeters and a height of 12 centimeters. What is the volume of the cylinder, in cubic centimeters?",
    choices: mc("m-geo-01", "60π", "120π", "300π", "600π"),
    correctAnswer: "m-geo-01-c",
    explanation:
      "The volume of a cylinder is πr²h. Substituting gives π(5)²(12) = π(25)(12) = 300π cubic centimeters. Using 2πrh instead computes the lateral surface area, giving 120π.",
    estimatedTimeSeconds: 60,
  },
  {
    id: "m-geo-02",
    section: "math",
    domain: "Geometry and Trigonometry",
    skill: "Lines, angles, and triangles",
    difficulty: "medium",
    type: "multiple_choice",
    stem: "In triangle ABC, the measure of angle A is 36°, and the measure of angle B is 3 times the measure of angle C. What is the measure, in degrees, of angle B?",
    choices: mc("m-geo-02", "36", "54", "108", "144"),
    correctAnswer: "m-geo-02-c",
    explanation:
      "The angles of a triangle sum to 180°. Letting angle C = c, we have 36 + 3c + c = 180, so 4c = 144 and c = 36. Angle B = 3(36) = 108°.",
    estimatedTimeSeconds: 75,
  },
  {
    id: "m-geo-03",
    section: "math",
    domain: "Geometry and Trigonometry",
    skill: "Right triangles and trigonometry",
    difficulty: "medium",
    type: "multiple_choice",
    stem: "In right triangle PQR, angle Q is the right angle, PQ = 9, and QR = 12. What is the value of sin R?",
    figure: {
      kind: "diagram",
      alt: "Right triangle PQR with the right angle at Q, side PQ of length 9 vertical, and side QR of length 12 horizontal.",
    },
    choices: mc("m-geo-03", "3/5", "4/5", "3/4", "4/3"),
    correctAnswer: "m-geo-03-a",
    explanation:
      "By the Pythagorean theorem the hypotenuse PR = √(9² + 12²) = √225 = 15. Angle R is opposite side PQ, so sin R = PQ/PR = 9/15 = 3/5. Choice B is cos R and choice C is tan R.",
    estimatedTimeSeconds: 85,
  },
  {
    id: "m-geo-04",
    section: "math",
    domain: "Geometry and Trigonometry",
    skill: "Circles",
    difficulty: "hard",
    type: "multiple_choice",
    expression: "x^2 + y^2 − 6x + 10y + 18 = 0",
    stem: "The given equation defines a circle in the xy-plane. What is the radius of the circle?",
    choices: mc("m-geo-04", "4", "8", "16", "√18"),
    correctAnswer: "m-geo-04-a",
    explanation:
      "Complete the square in both variables: (x² − 6x + 9) + (y² + 10y + 25) = −18 + 9 + 25, which gives (x − 3)² + (y + 5)² = 16. The radius is √16 = 4, and the center is (3, −5). Choice C is the square of the radius.",
    estimatedTimeSeconds: 120,
  },
  {
    id: "m-geo-05",
    section: "math",
    domain: "Geometry and Trigonometry",
    skill: "Right triangles and trigonometry",
    difficulty: "hard",
    type: "student_produced_response",
    stem: "In a right triangle, one acute angle measures x°, and sin(x°) = 0.28. What is the value of cos((90 − x)°)?",
    choices: [],
    correctAnswer: "0.28",
    acceptedAnswers: ["0.28", ".28", "7/25"],
    explanation:
      "In a right triangle the two acute angles are complementary, and the sine of either equals the cosine of the other. So cos((90 − x)°) = sin(x°) = 0.28.",
    estimatedTimeSeconds: 100,
  },
  {
    id: "m-geo-06",
    section: "math",
    domain: "Geometry and Trigonometry",
    skill: "Area and volume",
    difficulty: "medium",
    type: "student_produced_response",
    stem: "A rectangular prism has a length of 8 inches, a width of 5 inches, and a volume of 240 cubic inches. What is the height of the prism, in inches?",
    choices: [],
    correctAnswer: "6",
    explanation:
      "The volume of a rectangular prism is length × width × height. So 8 × 5 × h = 240, giving 40h = 240 and h = 6 inches.",
    estimatedTimeSeconds: 65,
  },
];

const INFORMATION_AND_IDEAS: Question[] = [
  {
    id: "rw-info-01",
    section: "rw",
    domain: "Information and Ideas",
    skill: "Central ideas and details",
    difficulty: "easy",
    type: "multiple_choice",
    passage:
      "Urban beekeepers in coastal cities have long assumed that their hives depend on cultivated flower beds. A four-year survey of the pollen carried back to rooftop hives in three port cities tells a different story. More than half the pollen sampled came from weedy species growing in vacant lots, rail corridors, and the cracked margins of parking areas — plants that nobody plants and few people notice.",
    stem: "Which choice best states the main idea of the text?",
    choices: mc(
      "rw-info-01",
      "Rooftop hives in port cities produce more honey than hives kept at ground level.",
      "Pollen surveys are the only reliable method for studying bees in cities.",
      "City bees draw heavily on uncultivated plants rather than on planted gardens.",
      "Cities should replace their cultivated flower beds with vacant lots.",
    ),
    correctAnswer: "rw-info-01-c",
    explanation:
      "The text sets up an assumption (hives depend on cultivated beds) and then reports a finding that overturns it (most pollen came from weedy, uncultivated plants). Choice C states that contrast. Choices A and B introduce comparisons the text never makes, and choice D turns a finding into a recommendation the text does not give.",
    estimatedTimeSeconds: 65,
  },
  {
    id: "rw-info-02",
    section: "rw",
    domain: "Information and Ideas",
    skill: "Command of evidence: textual",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "Archaeologist Nadia Ferreiro has proposed that the stone platforms at the Kellan site were built for storage rather than for ceremony, as earlier researchers assumed. She notes that the platforms are uniform in height, that they cluster well away from the settlement's burial ground, and that they show none of the ash residue that marks ceremonial surfaces elsewhere in the region.",
    stem: "Which finding, if true, would most directly support Ferreiro's proposal?",
    choices: mc(
      "rw-info-02",
      "Several of the platforms at the Kellan site were rebuilt at least twice.",
      "The Kellan settlement's burial ground remained in use for several centuries.",
      "Ceremonial platforms at a nearby site are also uniform in height.",
      "Residue analysis of the platform surfaces detects traces of stored grain.",
    ),
    correctAnswer: "rw-info-02-d",
    explanation:
      "Ferreiro's claim is that the platforms served storage. Direct physical evidence of stored goods on the surfaces supports exactly that, so choice D is strongest. Choice C would weaken her reasoning by removing uniformity as a distinguishing feature, and choices A and B are consistent with either interpretation.",
    estimatedTimeSeconds: 85,
  },
  {
    id: "rw-info-03",
    section: "rw",
    domain: "Information and Ideas",
    skill: "Command of evidence: quantitative",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "A wildlife team tracked red foxes across four habitat types to test the claim that foraging distance increases as habitat becomes more fragmented. The team ranked the four habitats from least to most fragmented as follows: dense forest, forest edge, suburban, and farmland.",
    table: {
      caption: "Mean daily foraging distance of tracked red foxes, by habitat",
      headers: ["Habitat", "Mean distance (km)", "Foxes tracked"],
      rows: [
        ["Dense forest", "2.1", "14"],
        ["Forest edge", "3.4", "16"],
        ["Suburban", "4.6", "15"],
        ["Farmland", "5.8", "12"],
      ],
    },
    stem: "Which choice best describes data from the table that support the team's claim?",
    choices: mc(
      "rw-info-03",
      "Mean foraging distance rises across the four habitats in the same order as the team's fragmentation ranking, from 2.1 km to 5.8 km.",
      "More foxes were tracked in forest edge habitat than in any other habitat.",
      "Foxes in suburban habitat travelled farther on average than foxes in farmland did.",
      "The difference in mean distance between dense forest and forest edge is less than 2 km.",
    ),
    correctAnswer: "rw-info-03-a",
    explanation:
      "The claim links greater fragmentation to longer foraging. The means rise in exactly the team's fragmentation order (2.1, 3.4, 4.6, 5.8), which is choice A. Choice C misreads the table, and choices B and D report true details that say nothing about fragmentation.",
    estimatedTimeSeconds: 95,
  },
  {
    id: "rw-info-04",
    section: "rw",
    domain: "Information and Ideas",
    skill: "Inferences",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "Composer Teodora Milić writes what she calls \"unfinished\" scores: each movement closes on a chord belonging to no key the piece has established. Performers report that audiences often hold their applause for several seconds after the final note, as though still waiting. Milić considers that silence part of the work, and she has said that a recording, which lets a listener end the silence whenever they choose, can capture only ______",
    stem: "Which choice most logically completes the text?",
    choices: mc(
      "rw-info-04",
      "the portion of the piece that the performers themselves control.",
      "the harmonic ambiguity that gives the scores their name.",
      "the applause that follows a live performance.",
      "a fraction of what the music does in a room.",
    ),
    correctAnswer: "rw-info-04-d",
    explanation:
      "Milić treats the shared, involuntary silence of a live audience as part of the work, and a recording hands that silence back to the listener's control. What a recording misses is therefore part of the whole effect, which choice D states. Choice B names something a recording reproduces perfectly well, and choices A and C contradict the passage's emphasis on the audience's waiting.",
    estimatedTimeSeconds: 100,
  },
  {
    id: "rw-info-05",
    section: "rw",
    domain: "Information and Ideas",
    skill: "Central ideas and details",
    difficulty: "hard",
    type: "multiple_choice",
    passage:
      "Restoration ecologists once treated a degraded wetland as a machine missing parts: identify the absent species, reintroduce them, and function returns. Two decades of mixed results have pushed the field toward a less mechanical view. Reintroductions now routinely fail in wetlands whose water chemistry has shifted, and they routinely succeed in wetlands where chemistry had recovered on its own before any species were added. The lesson practitioners draw is not that reintroduction is useless but that it is a late step widely misread as a first one.",
    stem: "Which choice best states the main idea of the text?",
    choices: mc(
      "rw-info-05",
      "Species reintroduction has been shown to be ineffective as a wetland restoration technique.",
      "Wetland restoration succeeds only when water chemistry is left to recover without intervention.",
      "Ecologists continue to disagree about whether wetlands should be understood as machines.",
      "Reintroduction works once underlying conditions have recovered, so it belongs later in the restoration sequence.",
    ),
    correctAnswer: "rw-info-05-d",
    explanation:
      "The final sentence states the point directly: reintroduction is not useless, it is simply mistimed. Choice D captures both halves. Choice A contradicts the explicit disclaimer, choice B overstates the chemistry finding into a rule about non-intervention, and choice C describes a disagreement the text does not report.",
    estimatedTimeSeconds: 105,
  },
  {
    id: "rw-info-06",
    section: "rw",
    domain: "Information and Ideas",
    skill: "Inferences",
    difficulty: "hard",
    type: "multiple_choice",
    passage:
      "In a controlled trial, participants estimated the length of a spoken pause in a conversation they were watching. When the speakers used the participant's first language, estimates clustered tightly around the true duration. When the speakers used an unfamiliar language, estimates grew both longer and more variable, even though the pauses were identical in length. The researchers note that participants in the unfamiliar-language condition also reported more difficulty telling where one speaker's turn ended and the next began.",
    stem: "Which choice most logically completes the text? The researchers' final observation suggests that the inflated estimates arose because ______",
    choices: mc(
      "rw-info-06",
      "participants in the unfamiliar-language condition paid less attention to the recordings.",
      "judging a pause depends on recognizing the turn boundaries that mark where it starts and stops.",
      "pauses in unfamiliar languages are typically longer than pauses in familiar ones.",
      "participants deliberately overstated any duration they felt unsure about.",
    ),
    correctAnswer: "rw-info-06-b",
    explanation:
      "The final sentence connects the distorted estimates to trouble locating turn boundaries, which are precisely the edges that define a pause. Choice B draws that link. Choice C is ruled out because the pauses were identical in length, and choices A and D invent explanations the passage does not support.",
    estimatedTimeSeconds: 110,
  },
];

const CRAFT_AND_STRUCTURE: Question[] = [
  {
    id: "rw-craft-01",
    section: "rw",
    domain: "Craft and Structure",
    skill: "Words in context",
    difficulty: "easy",
    type: "multiple_choice",
    passage:
      "The museum's new catalogue is ______ : it lists every object in the collection, including the several thousand fragments that have never been put on display.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: mc("rw-craft-01", "exhaustive", "tentative", "decorative", "abbreviated"),
    correctAnswer: "rw-craft-01-a",
    explanation:
      "The colon introduces an explanation: the catalogue lists everything, down to undisplayed fragments. \"Exhaustive\" means complete to that degree. \"Abbreviated\" is the opposite, and \"tentative\" and \"decorative\" describe qualities the sentence never raises.",
    estimatedTimeSeconds: 55,
  },
  {
    id: "rw-craft-02",
    section: "rw",
    domain: "Craft and Structure",
    skill: "Words in context",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "Early reviewers found the novelist's dialogue ______ , complaining that her characters state their motives outright instead of letting readers infer them. Later critics have defended the same passages as a deliberate refusal of fashionable indirection.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: mc("rw-craft-02", "inscrutable", "unadorned", "melodious", "explicit"),
    correctAnswer: "rw-craft-02-d",
    explanation:
      "The complaint is specifically that motives are stated outright rather than implied, and \"explicit\" names that quality. \"Inscrutable\" means the opposite. \"Unadorned\" concerns ornament rather than directness, and \"melodious\" is unrelated.",
    estimatedTimeSeconds: 75,
  },
  {
    id: "rw-craft-03",
    section: "rw",
    domain: "Craft and Structure",
    skill: "Text structure and purpose",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "Most accounts of the 1908 flood begin at the river and end at the rebuilt embankment. Wu's history begins instead in the town's insurance office, where clerks spent the following winter deciding which losses counted. From those ledgers Wu reconstructs a hierarchy of damage that the engineering record erases: whose ruined workshop was a business, and whose was a shed.",
    stem: "Which choice best describes the overall structure of the text?",
    choices: mc(
      "rw-craft-03",
      "It presents a conventional approach, introduces a work that departs from it, and indicates what that departure reveals.",
      "It summarizes a historical event and then lists the sources available for studying it.",
      "It criticizes a historian's method and then proposes an alternative to that method.",
      "It traces the development of a field of study across several decades.",
    ),
    correctAnswer: "rw-craft-03-a",
    explanation:
      "The three sentences do three jobs in sequence: state the usual approach, introduce Wu's different starting point, and say what that yields. Choice A matches. Choice C reverses the text's stance, since Wu's method is presented approvingly, and choices B and D describe structures the text does not use.",
    estimatedTimeSeconds: 90,
  },
  {
    id: "rw-craft-04",
    section: "rw",
    domain: "Craft and Structure",
    skill: "Cross-text connections",
    difficulty: "hard",
    type: "multiple_choice",
    passage:
      "Text 1\n\nMuseums that return objects to their communities of origin lose more than the objects. They lose the comparative display — the arrangement that lets a visitor see two traditions side by side — and no single community's collection can offer that way of seeing.",
    passageSecondary:
      "Text 2\n\nThe comparative display is not a neutral good. It was assembled by the same acquisitions that emptied the places the objects came from, and it teaches visitors to read those places as sources rather than as destinations. A visitor who has to travel to see an object learns something no vitrine can teach.",
    stem: "Based on the texts, how would the author of Text 2 most likely respond to the claim about comparative displays in Text 1?",
    choices: mc(
      "rw-craft-04",
      "By agreeing that comparative displays are valuable but arguing that returning objects is nevertheless legally required.",
      "By questioning whether museum visitors actually notice comparative displays at all.",
      "By suggesting that museums can recreate comparative displays using digital copies of returned objects.",
      "By arguing that whatever comparative displays offer is outweighed by how they were assembled and what they teach.",
    ),
    correctAnswer: "rw-craft-04-d",
    explanation:
      "Text 2 does not deny that the comparative display shows something; it argues that the display's origins and the lesson it teaches count against it, and that travelling to an object teaches more. Choice D captures that trade-off. Choice A adds a legal argument absent from Text 2, and choices B and C raise points neither text makes.",
    estimatedTimeSeconds: 120,
  },
  {
    id: "rw-craft-05",
    section: "rw",
    domain: "Craft and Structure",
    skill: "Text structure and purpose",
    difficulty: "hard",
    type: "multiple_choice",
    passage:
      "A field guide is usually read as a tool. Botanist Imre Kovač reads the 1889 guide to the valley's ferns as a record of its author's anxieties: the entries run longest and most hedged exactly where the species are hardest to tell apart, and shortest where the author was confident. Kovač does not claim that the guide is inaccurate. He claims that its shape preserves a mind at work.",
    stem: "Which choice best states the main purpose of the text?",
    choices: mc(
      "rw-craft-05",
      "To argue that the 1889 field guide contains errors that later botanists corrected.",
      "To describe an unconventional way of reading a familiar kind of text and to mark the limits of that reading.",
      "To compare two botanists' approaches to identifying fern species.",
      "To explain the principles by which field guides are typically organized.",
    ),
    correctAnswer: "rw-craft-05-b",
    explanation:
      "The text introduces Kovač's unusual reading and then, in the last two sentences, states what he is not claiming. Choice B accounts for both moves. Choice A is explicitly denied by the text, and choices C and D describe content the text does not contain.",
    estimatedTimeSeconds: 110,
  },
  {
    id: "rw-craft-06",
    section: "rw",
    domain: "Craft and Structure",
    skill: "Words in context",
    difficulty: "hard",
    type: "multiple_choice",
    passage:
      "The committee's report is careful never to assign blame, yet its ______ is unmistakable: three departments are named in every section describing a delay, and no other department is named anywhere.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: mc("rw-craft-06", "ambivalence", "redundancy", "exoneration", "implication"),
    correctAnswer: "rw-craft-06-d",
    explanation:
      "The report avoids stating blame outright but points at it unmistakably through the pattern of naming, which is what an implication does. \"Exoneration\" reverses the meaning, and \"ambivalence\" and \"redundancy\" do not fit a report whose message the sentence calls unmistakable.",
    estimatedTimeSeconds: 95,
  },
];

const EXPRESSION_OF_IDEAS: Question[] = [
  {
    id: "rw-expr-01",
    section: "rw",
    domain: "Expression of Ideas",
    skill: "Transitions",
    difficulty: "easy",
    type: "multiple_choice",
    passage:
      "The alloy is far lighter than steel and resists corrosion in salt water. ______ , it costs roughly four times as much to produce, which has confined its use to specialized marine hardware.",
    stem: "Which choice completes the text with the most logical transition?",
    choices: mc("rw-expr-01", "However", "Likewise", "Therefore", "For instance"),
    correctAnswer: "rw-expr-01-a",
    explanation:
      "The first sentence lists advantages and the second introduces a drawback, so the transition must signal contrast. \"Likewise\" signals similarity, \"Therefore\" signals a result, and \"For instance\" introduces an example.",
    estimatedTimeSeconds: 50,
  },
  {
    id: "rw-expr-02",
    section: "rw",
    domain: "Expression of Ideas",
    skill: "Transitions",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "Seed banks were designed to guard genetic diversity against catastrophic loss. ______ , they have proved most useful in ordinary years, supplying breeders with varieties that commercial agriculture had quietly stopped growing.",
    stem: "Which choice completes the text with the most logical transition?",
    choices: mc("rw-expr-02", "In practice", "As a result", "In addition", "By comparison"),
    correctAnswer: "rw-expr-02-a",
    explanation:
      "The sentence contrasts the purpose seed banks were designed for with how they actually get used, and \"In practice\" marks exactly that design-versus-reality contrast. \"As a result\" implies causation, while \"In addition\" and \"By comparison\" miss the contrast entirely.",
    estimatedTimeSeconds: 70,
  },
  {
    id: "rw-expr-03",
    section: "rw",
    domain: "Expression of Ideas",
    skill: "Rhetorical synthesis",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "While researching a topic, a student has taken the following notes:\n\n• The Valmara estuary was dredged for shipping between 1954 and 1971.\n• Dredging removed roughly 60% of the estuary's eelgrass beds.\n• Eelgrass beds shelter juvenile fish and stabilize sediment.\n• A replanting programme began in 2009.\n• By 2023, eelgrass covered about 45% of its pre-dredging area.",
    stem: "The student wants to emphasize the extent of the recovery achieved by the replanting programme. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: mc(
      "rw-expr-03",
      "The Valmara estuary was dredged for shipping between 1954 and 1971, a period of roughly seventeen years.",
      "Eelgrass beds, which shelter juvenile fish and stabilize sediment, were once abundant in the Valmara estuary.",
      "Dredging removed roughly 60% of the estuary's eelgrass beds, and a replanting programme began in 2009.",
      "A replanting programme begun in 2009 had restored eelgrass to about 45% of its pre-dredging area by 2023.",
    ),
    correctAnswer: "rw-expr-03-d",
    explanation:
      "The goal is the extent of recovery, so the answer must pair the programme with how much eelgrass came back. Only choice D reports the 45% figure. Choices A and B omit the programme altogether, and choice C names it without saying what it achieved.",
    estimatedTimeSeconds: 100,
  },
  {
    id: "rw-expr-04",
    section: "rw",
    domain: "Expression of Ideas",
    skill: "Rhetorical synthesis",
    difficulty: "hard",
    type: "multiple_choice",
    passage:
      "While researching a topic, a student has taken the following notes:\n\n• Thermal imaging surveys detect heat loss from building exteriors.\n• A 2021 survey of the Brackenhall estate imaged 240 homes.\n• 71 of those homes showed heat loss concentrated at roof junctions.\n• Roof-junction loss usually indicates missing or compressed insulation.\n• Retrofitting insulation at roof junctions costs less than replacing windows.",
    stem: "The student wants to present the survey's central finding along with its practical implication. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: mc(
      "rw-expr-04",
      "Thermal imaging surveys, which detect heat loss from building exteriors, were carried out on the Brackenhall estate in 2021.",
      "A 2021 survey imaged 240 homes on the Brackenhall estate, and 71 of them showed heat loss.",
      "Retrofitting insulation at roof junctions costs less than replacing windows, according to a 2021 survey of the Brackenhall estate.",
      "Of the 240 Brackenhall homes imaged in 2021, 71 lost heat mainly at roof junctions — a pattern that points to insulation gaps, which cost less to fix than windows do to replace.",
    ),
    correctAnswer: "rw-expr-04-d",
    explanation:
      "The goal has two parts: the finding and what follows from it. Choice D gives the 71-of-240 result, its likely cause, and the cheaper remedy. Choice B stops at the finding, choice C gives only the implication, and choice A gives neither.",
    estimatedTimeSeconds: 115,
  },
  {
    id: "rw-expr-05",
    section: "rw",
    domain: "Expression of Ideas",
    skill: "Transitions",
    difficulty: "hard",
    type: "multiple_choice",
    passage:
      "Critics of the scheme predicted that removing on-street parking would drive trade away from the high street. Receipts from the two years since show the opposite. ______ , the shops that gained the most were the ones whose owners had objected most loudly.",
    stem: "Which choice completes the text with the most logical transition?",
    choices: mc("rw-expr-05", "Nevertheless", "Consequently", "Similarly", "In fact"),
    correctAnswer: "rw-expr-05-d",
    explanation:
      "The third sentence sharpens the reversal already announced in the second, and \"In fact\" introduces that stronger instance. \"Nevertheless\" would signal a concession against the previous sentence, \"Similarly\" a parallel, and \"Consequently\" a result the gains are not.",
    estimatedTimeSeconds: 90,
  },
  {
    id: "rw-expr-06",
    section: "rw",
    domain: "Expression of Ideas",
    skill: "Rhetorical synthesis",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "While researching a topic, a student has taken the following notes:\n\n• Lichens colonize bare rock surfaces and grow at predictable rates.\n• Lichenometry estimates how long a rock surface has been exposed by measuring lichen size.\n• The method works best on surfaces exposed within the last 500 years.\n• On older surfaces, lichen growth slows and separate colonies merge.\n• Radiocarbon dating covers far longer spans but requires organic material.",
    stem: "The student wants to explain why lichenometry is limited to relatively recent surfaces. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: mc(
      "rw-expr-06",
      "Lichenometry estimates exposure age by measuring lichen size, whereas radiocarbon dating requires organic material.",
      "Because lichen growth slows and separate colonies merge over time, lichenometry cannot reliably date surfaces exposed more than about 500 years ago.",
      "Lichens colonize bare rock surfaces and grow at predictable rates, which is what makes lichenometry possible.",
      "Radiocarbon dating covers far longer spans of time than lichenometry does.",
    ),
    correctAnswer: "rw-expr-06-b",
    explanation:
      "The goal asks for the reason behind the limit, and only choice B gives the mechanism (slowing growth, merging colonies) together with the roughly 500-year ceiling. Choice C explains why the method works rather than why it fails, and choices A and D contrast it with another method without explaining the limit.",
    estimatedTimeSeconds: 100,
  },
];

const STANDARD_ENGLISH_CONVENTIONS: Question[] = [
  {
    id: "rw-conv-01",
    section: "rw",
    domain: "Standard English Conventions",
    skill: "Form, structure, and sense",
    difficulty: "easy",
    type: "multiple_choice",
    passage:
      "The collection of manuscripts donated by the linguist's family ______ several notebooks written in a script that has never been identified.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: mc("rw-conv-01", "include", "includes", "are including", "have included"),
    correctAnswer: "rw-conv-01-b",
    explanation:
      "The subject is the singular noun \"collection,\" not the plural \"manuscripts\" inside the modifying phrase, so the verb must be singular: \"includes.\" Choices A, C and D are all plural forms.",
    estimatedTimeSeconds: 55,
  },
  {
    id: "rw-conv-02",
    section: "rw",
    domain: "Standard English Conventions",
    skill: "Boundaries",
    difficulty: "easy",
    type: "multiple_choice",
    passage:
      "The reservoir supplies drinking water to four towns ______ it also regulates the river's flow during the spring melt.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: mc("rw-conv-02", ", and", ",", "(no punctuation)", ", which"),
    correctAnswer: "rw-conv-02-a",
    explanation:
      "Both halves are independent clauses, so joining them needs a comma plus a coordinating conjunction. Choice B creates a comma splice, choice C fuses the clauses, and choice D introduces a relative pronoun that leaves the second clause ungrammatical.",
    estimatedTimeSeconds: 65,
  },
  {
    id: "rw-conv-03",
    section: "rw",
    domain: "Standard English Conventions",
    skill: "Boundaries",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "Marsh harriers had not nested in the county for sixty years ______ in 2019 a pair raised three chicks in a reedbed beside a disused canal.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: mc("rw-conv-03", ",", ", that", "and,", ";"),
    correctAnswer: "rw-conv-03-d",
    explanation:
      "Two independent clauses with no conjunction between them require a semicolon. Choice A produces a comma splice, and choices B and C are not standard ways of linking independent clauses.",
    estimatedTimeSeconds: 70,
  },
  {
    id: "rw-conv-04",
    section: "rw",
    domain: "Standard English Conventions",
    skill: "Form, structure, and sense",
    difficulty: "medium",
    type: "multiple_choice",
    passage:
      "By the time the survey team reached the summit ridge in 1953, the glacier that appeared on the 1902 map ______ nearly a kilometre.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: mc("rw-conv-04", "retreats", "has retreated", "had retreated", "will have retreated"),
    correctAnswer: "rw-conv-04-c",
    explanation:
      "The retreat finished before another past event, the 1953 survey, so the past perfect \"had retreated\" is required. Choice B relates a past action to the present, and choices A and D are present and future forms.",
    estimatedTimeSeconds: 75,
  },
  {
    id: "rw-conv-05",
    section: "rw",
    domain: "Standard English Conventions",
    skill: "Boundaries",
    difficulty: "hard",
    type: "multiple_choice",
    passage:
      "The city's oldest surviving tram ______ runs on a single heritage line each Sunday.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: mc(
      "rw-conv-05",
      ", built in 1904 and restored twice since,",
      "built in 1904 and restored twice since,",
      ", built in 1904 and restored twice since",
      "built in 1904, and restored twice since,",
    ),
    correctAnswer: "rw-conv-05-a",
    explanation:
      "The phrase is a nonessential supplement interrupting the subject and its verb, so it needs a matching pair of commas around it. Choices B and C each supply only one of the pair, and choice D punctuates the middle of the phrase instead of its edges.",
    estimatedTimeSeconds: 95,
  },
  {
    id: "rw-conv-06",
    section: "rw",
    domain: "Standard English Conventions",
    skill: "Form, structure, and sense",
    difficulty: "hard",
    type: "multiple_choice",
    passage: "Rewritten three times before publication, ______",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: mc(
      "rw-conv-06",
      "the editor finally approved the opening chapter.",
      "the opening chapter finally won the editor's approval.",
      "approval of the opening chapter finally came from the editor.",
      "it was the editor who finally approved the opening chapter.",
    ),
    correctAnswer: "rw-conv-06-b",
    explanation:
      "The opening modifier describes whatever the main clause's subject is, and the thing rewritten is the chapter, not the editor or the approval. Only choice B makes \"the opening chapter\" the subject. Choices A, C and D leave the modifier dangling.",
    estimatedTimeSeconds: 100,
  },
];

/** All 48 seed questions, six per domain across the eight domains. */
export const MOCK_QUESTIONS: Question[] = [
  ...ALGEBRA,
  ...ADVANCED_MATH,
  ...PROBLEM_SOLVING,
  ...GEOMETRY,
  ...INFORMATION_AND_IDEAS,
  ...CRAFT_AND_STRUCTURE,
  ...EXPRESSION_OF_IDEAS,
  ...STANDARD_ENGLISH_CONVENTIONS,
];
