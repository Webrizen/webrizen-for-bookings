import { createMocks } from 'node-mocks-http';
import { GET, POST } from '../src/app/api/admin/venues/route';
import dbConnect from '../src/lib/db';
import Venue from '../src/models/Venue';

// Mock the dbConnect function
jest.mock('../src/lib/db', () => jest.fn());
// Mock the Venue model
jest.mock('../src/models/Venue');

describe('/api/admin/venues', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all venues', async () => {
      const mockVenues = [{ name: 'Venue 1' }, { name: 'Venue 2' }];
      Venue.find.mockResolvedValue(mockVenues);

      const { req } = createMocks({
        method: 'GET',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockVenues);
      expect(dbConnect).toHaveBeenCalledTimes(1);
      expect(Venue.find).toHaveBeenCalledTimes(1);
    });

    it('should return an error if database query fails', async () => {
      const errorMessage = 'Database error';
      Venue.find.mockRejectedValue(new Error(errorMessage));

      const { req } = createMocks({
        method: 'GET',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe(errorMessage);
    });
  });

  describe('POST', () => {
    it('should create a new venue', async () => {
        const newVenue = { name: 'New Venue', capacity: 100 };
        Venue.create.mockResolvedValue(newVenue);

        const { req } = createMocks({
            method: 'POST',
        });

        req.json = jest.fn().mockResolvedValue(newVenue);

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.data).toEqual(newVenue);
        expect(dbConnect).toHaveBeenCalledTimes(1);
        expect(Venue.create).toHaveBeenCalledWith(newVenue);
    });
  });
});
