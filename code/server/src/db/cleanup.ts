"use strict";

import { emptyDB } from "../../test_integration/utils";

/**
 * Deletes all data from the database.
 * This function must be called before any integration test, to ensure a clean database state for each test run.
 */

export const cleanup = emptyDB;
